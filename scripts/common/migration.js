export async function migrateWorld() {
    const schemaVersion = 2;
    const worldSchemaVersion = Number(game.settings.get("wrath-and-glory", "worldSchemaVersion"));
    if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
        ui.notifications.info("Upgrading the world, please wait...");
        for (let actor of game.actors.contents) {
            try {
                const update = migrateActorData(actor.data, worldSchemaVersion);
                if (!isObjectEmpty(update)) {
                    await actor.update(update);
                }
            } catch (e) {
                console.error(e);
            }
        }
        for (let item of game.items.contents) {
            try {
                const update = migrateItemData(item.data, worldSchemaVersion);
                update.effects = [getEffectsFromItem(item.data)].filter(i => !isObjectEmpty(i))
                if (!isObjectEmpty(update)) {
                    await item.update(update);
                }
            } catch (e) {
                console.error(e);
            }
        }
        // for (let scene of game.scenes.contents) {
        //     try {
        //         const update = migrateSceneData(scene.data, worldSchemaVersion);
        //         if (!isObjectEmpty(update)) {
        //             await scene.update(update);
        //         }
        //     } catch (err) {
        //         console.error(err);
        //     }
        // }
        // for (let pack of game.packs.filter((p) => p.metadata.package === "world" && ["Actor"].includes(p.metadata.entity))) {
        //     await migrateCompendium(pack, worldSchemaVersion);
        // }
        game.settings.set("wrath-and-glory", "worldSchemaVersion", schemaVersion);
        ui.notifications.info("Upgrade complete!");
    }
};

function migrateActorData(actor, worldSchemaVersion) {
    const update = {};
    if (worldSchemaVersion < 2) {
        if (actor.type === "agent" || actor.type === "threat") {
            update["data.combat.resilience"] = actor.data.combat.resilence
        }
        update.items = actor.items.map(i => migrateItemData(i.data, worldSchemaVersion)).filter(i => !isObjectEmpty(i))
        update.effects = actor.items.map(i => getEffectsFromItem(i.data)).filter(i => !isObjectEmpty(i))
    }
    return update;
};

function migrateItemData(item, worldSchemaVersion) {
    const update = {};
    if (worldSchemaVersion < 2) {
        if (item.type === "weapon" || item.type == "armour") {
            update["data.traits"] = item.data.traits.split(",").map(i => {
                if (!i)
                    return
                let trait = i.trim()
                let traitObj = {}
                if (trait.includes("("))
                {
                    let nameAndRating = trait.split("(")

                    traitObj.name = game.wng.utility.findKey(nameAndRating[0].trim(), game.wng.config[`${item.type}Traits`])
                    traitObj.rating = nameAndRating[1].split(")")[0]
                }
                else // No Rating 
                {
                    traitObj.name = game.wng.utility.findKey(trait, game.wng.config[`${item.type}Traits`])
                }
                return traitObj
            }).filter( i => !!i)
        }
        if (item.data.effect)
            update["data.traits.description"] = item.data.description += "<br>" + item.data.effect 
    }
    if (!isObjectEmpty(update)) {
        update._id = item._id;
    }
    return update;
};


function getEffectsFromItem(item) 
{
    let bonus = item.data.bonus
    let changes = []

    for(let group in bonus)
    {
        for(let key in bonus[group])
        {
            if (bonus[group][key])
            {
                changes.push({
                    key : `data.${group}.${key}.bonus`,
                    value : bonus[group][key],
                    mode : 2
                })
            }
        }
    }
    if (changes.length)
        return {label : item.name, icon : item.img, changes}
    else return {}
    
}

const migrateSceneData = (scene, worldSchemaVersion) => {
    // const tokens = foundry.utils.deepClone(scene.tokens);
    // return {
    //     tokens: tokens.map((tokenData) => {
    //         if (!tokenData.actorId || tokenData.actorLink || !tokenData.actorData.data) {
    //             tokenData.actorData = {};
    //             return tokenData;
    //         }
    //         const token = new Token(tokenData);
    //         if (!token.actor) {
    //             tokenData.actorId = null;
    //             tokenData.actorData = {};
    //         } else if (!tokenData.actorLink && token.data.actorData.items) {
    //             const update = migrateActorData(token.data.actorData, worldSchemaVersion);
    //             console.log("ACTOR CHANGED", token.data.actorData, update);
    //             tokenData.actorData = mergeObject(token.data.actorData, update);
    //         }
    //         return tokenData;
    //     }),
    // };
};

export const migrateCompendium = async function (pack, worldSchemaVersion) {
    // const entity = pack.metadata.entity;

    // await pack.migrate();
    // const content = await pack.getContent();

    // for (let ent of content) {
    //     let updateData = {};
    //     if (entity === "Actor") {
    //         updateData = migrateActorData(ent.data, worldSchemaVersion);
    //     }
    //     if (!isObjectEmpty(updateData)) {
    //         expandObject(updateData);
    //         updateData["_id"] = ent._id;
    //         await pack.updateEntity(updateData);
    //     }
    // }
};
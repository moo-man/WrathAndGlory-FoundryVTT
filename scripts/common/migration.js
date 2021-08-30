export async function migrateWorld() {
    const schemaVersion = 3;
    const worldSchemaVersion = Number(game.settings.get("wrath-and-glory", "worldSchemaVersion"));
    if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
        ui.notifications.info("Upgrading the world, please wait...");
        if (worldSchemaVersion < 2) {
            for (let actor of game.actors.contents) {
                try {
                    const update = migrateActorData(actor.data, worldSchemaVersion);
                    if (!isObjectEmpty(update)) {
                        console.log(`Migrating ${actor.name}`)
                        await actor.update(update);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
        if (worldSchemaVersion < 2) {
            for (let item of game.items.contents) {
                try {
                    console.log(`Migrating ${item.name}`)
                    const update = migrateItemData(item.data, worldSchemaVersion);
                    update.effects = [getEffectsFromItem(item.data)].filter(i => !isObjectEmpty(i))
                    if (!isObjectEmpty(update)) {
                        await item.update(update);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
        for (let pack of game.packs) {
            try {
                if (pack.metadata.package == "world") {
                    console.log(`Migrating ${pack.metadata.label}`)
                    await migrateCompendium(pack)
                }
            } catch (e) {
                console.error(e);
            }
        }
        game.settings.set("wrath-and-glory", "worldSchemaVersion", schemaVersion);
        ui.notifications.info("Upgrade complete!");
    }
};

function migrateActorData(actor, worldSchemaVersion) {
    let update = {};
    update = {
        "flags.wrath-and-glory.autoCalc.defense": true,
        "flags.wrath-and-glory.autoCalc.resilience": true,
        "flags.wrath-and-glory.autoCalc.shock": true,
        "flags.wrath-and-glory.autoCalc.awareness": true,
        "flags.wrath-and-glory.autoCalc.determination": true,
        "flags.wrath-and-glory.autoCalc.wounds": true,
        "flags.wrath-and-glory.autoCalc.conviction": true
    }
    if (actor.type === "agent" || actor.type === "threat") {
        update["data.combat.resilience"] = actor.data.combat.resilence
    }
    update.items = actor.items.map(i => migrateItemData(i.data, worldSchemaVersion)).filter(i => !isObjectEmpty(i))
    update.effects = actor.items.map(i => getEffectsFromItem(i.data)).filter(i => !isObjectEmpty(i))
    return update;
};

function migrateItemData(item, worldSchemaVersion) {
    const update = {};
    if (item.type === "weapon" || item.type == "armour") {
        update["data.traits"] = item.data.traits.split(",").map(i => {
            if (!i)
                return
            let trait = i.trim()
            let traitObj = {}
            if (trait.includes("(")) {
                let nameAndRating = trait.split("(")

                traitObj.name = game.wng.utility.findKey(nameAndRating[0].trim(), game.wng.config[`${item.type}Traits`])
                traitObj.rating = nameAndRating[1].split(")")[0]
            }
            else // No Rating 
            {
                traitObj.name = game.wng.utility.findKey(trait, game.wng.config[`${item.type}Traits`])
            }
            return traitObj
        }).filter(i => !!i)
    }
    if (item.data.effect)
        update["data.traits.description"] = item.data.description += "<br>" + item.data.effect

    if (!isObjectEmpty(update)) {
        update._id = item._id;
    }
    return update;
};


function getEffectsFromItem(item) {
    let bonus = item.data.bonus
    let changes = []

    for (let group in bonus) {
        for (let key in bonus[group]) {
            if (bonus[group][key]) {
                changes.push({
                    key: `data.${group}.${key}.bonus`,
                    value: bonus[group][key],
                    mode: 2
                })
            }
        }
    }
    if (changes.length)
        return { label: item.name, icon: item.img, changes }
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

async function migrateCompendium(pack, worldSchemaVersion) {
    const entity = pack.metadata.entity;

    await pack.migrate();
    const content = await pack.getDocuments();

    for (let ent of content) {
        let updateData = {};
        if (entity === "Actor") {
            updateData = migrateActorData(ent.data, worldSchemaVersion);
        }
        else if (entity === "Item") {
            updateData = migrateItemData(ent.data, worldSchemaVersion);
        }
        if (!isObjectEmpty(updateData)) {
            console.log(`Updating ${ent.name}`, updateData)
            await ent.update(updateData);
        }
    }
};
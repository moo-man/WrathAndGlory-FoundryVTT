export async function migrateWorld() {
    const schemaVersion = 4;
    const worldSchemaVersion = Number(game.settings.get("wrath-and-glory", "worldSchemaVersion"));
    if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
        ui.notifications.info("Upgrading the world, please wait...");
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
            for (let item of game.items.contents) {
                try {
                    console.log(`Migrating ${item.name}`)
                    const update = migrateItemData(item.data, worldSchemaVersion);
                    if (!isObjectEmpty(update)) {
                        console.log(`Migrating ${item.name}`)
                        await item.update(update);
                    }
                } catch (e) {
                    console.error(e);
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

    updateData = {}
    // for(let attribute in actor.data.attributes)
    // {   
    //     updateData[`data.attributes.${attribute}.`]
    // }

    updateData.items = actor.items.map(i => migrateItemData(i.data, worldSchemaVersion)).filter(i => !isObjectEmpty(i))
    return update;
}


function migrateItemData(item, worldSchemaVersion) {
    const update = {};
    if (item.type === "weapon" && !item.data.upgrades) {
        update["data.upgrades"] = []

    return update;
};
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
            updateData = migrateActorData(ent.data);
        }
        else if (entity === "Item") {
            updateData = migrateItemData(ent.data);
        }
        if (!isObjectEmpty(updateData)) {
            console.log(`Migrating ${ent.name} in ${pack.metadata.label}`)
            await ent.update(updateData);
        }
    }
};
export async function migrateWorld() {
    const schemaVersion = 5;
    const worldSchemaVersion = Number(game.settings.get("wrath-and-glory", "worldSchemaVersion"));
    if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
        ui.notifications.info("Upgrading the world, please wait...");
            for (let actor of game.actors.contents) {
                try {
                    const update = migrateActorData(actor.data);
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
                    const update = migrateItemData(item.data);
                    if (!isObjectEmpty(update)) {
                        console.log(`Migrating ${item.name}`)
                        await item.update(update);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        game.settings.set("wrath-and-glory", "worldSchemaVersion", schemaVersion);
        ui.notifications.info("Upgrade complete!");
    }
};

function migrateActorData(actor) {
    const updateData = {_id: actor._id}
    updateData.effects = actor.effects.map(migrateEffectData)
    return updateData;
}


function migrateItemData(item) {
    const updateData = {_id : item._id};
    updateData.effects = item.effects.map(migrateEffectData)
    return updateData;
}

function migrateEffectData(effect)
{
    let effectData = effect.toObject()

    let description = getProperty(effectData, "flags.wrath-and-glory.description")
    effectData.changes.forEach((change, i) => {
        if (change.mode == 0)
        {
            change.mode = 6
            setProperty(effectData, `flags.wrath-and-glory.changeCondition.${i}`, {description, script:""})
        }
    })
    return effectData
}


export const migrateWorld = async () => {
    const schemaVersion = 1;
    const worldSchemaVersion = Number(game.settings.get("wrath-and-glory", "worldSchemaVersion"));
    if (worldSchemaVersion !== schemaVersion && game.user.isGM) {
        ui.notifications.info("Upgrading the world, please wait...");
        for (let actor of game.actors.entities) {
            try {
                const update = migrateActorData(actor.data, worldSchemaVersion);
                if (!isObjectEmpty(update)) {
                    await actor.update(update, {enforceTypes: false});
                }
            } catch (e) {
                console.error(e);
            }
        }
        for (let item of game.items.entities) {
            try {
                const update = migrateItemData(item.data, worldSchemaVersion);
                if (!isObjectEmpty(update)) {
                    await item.update(update, {enforceTypes: false});
                }
            } catch (e) {
                console.error(e);
            }
        }
        for (let scene of game.scenes.entities) {
            try {
                const update = migrateSceneData(scene.data, worldSchemaVersion);
                if (!isObjectEmpty(update)) {
                    await scene.update(update, {enforceTypes: false});
                }
            } catch (err) {
                console.error(err);
            }
        }
        for (let pack of game.packs.filter((p) => p.metadata.package === "world" && ["Actor"].includes(p.metadata.entity))) {
            await migrateCompendium(pack, worldSchemaVersion);
        }
        game.settings.set("wrath-and-glory", "worldSchemaVersion", schemaVersion);
        ui.notifications.info("Upgrade complete!");
    }
};

const migrateActorData = (actor, worldSchemaVersion) => {
    const update = {};
    if (worldSchemaVersion < 1) {
        if (actor.type === "agent" || actor.type === "threat") {
            update["data.combat.stealth"] = 0;
        }
    }
    let itemsChanged = false;
    const items = actor.items.map((item) => {
        const itemUpdate = migrateItemData(item, worldSchemaVersion);
        if (!isObjectEmpty(itemUpdate)) {
            itemsChanged = true;
            return mergeObject(item, itemUpdate, {enforceTypes: false, inplace: false});
        }
        return item;
    });
    if (itemsChanged) {
        update.items = items;
    }
    return update;
};

const migrateItemData = (item, worldSchemaVersion) => {
    const update = {};
    if (worldSchemaVersion < 1) {
        if (item.type === "weapon") {
            update["data.attack"] = {
                base: 0,
                bonus: 0,
                rank: "none"
            };
            update["data.damage"] = {
                base: item.data.damage,
                bonus: 0,
                rank: "none"
            };
            update["data.ed"] = {
                base: item.data.ed,
                bonus: 0,
                rank: "none",
                die: {
                    one: 0,
                    two: 0,
                    three: 0,
                    four: 1,
                    five: 1,
                    six: 2,
                }
            };
            update["data.ap"] = {
                base: item.data.ap,
                bonus: 0,
                rank: "none"
            };
        } else if (item.type === "psychicPower") {
            update["data.damage"] = {
                base: 0,
                bonus: 0,
                rank: "none",
                die: {
                    one: 0,
                    two: 0,
                    three: 0,
                    four: 1,
                    five: 1,
                    six: 2,
                }
            };
            update["data.ed"] = {
                base: 0,
                bonus: 0,
                rank: "none"
            };
        }
    }
    if (!isObjectEmpty(update)) {
        update._id = item._id;
    }
    return update;
};

const migrateSceneData = (scene, worldSchemaVersion) => {
    const tokens = duplicate(scene.tokens);
    return {
        tokens: tokens.map((tokenData) => {
            if (!tokenData.actorId || tokenData.actorLink || !tokenData.actorData.data) {
                tokenData.actorData = {};
                return tokenData;
            }
            const token = new Token(tokenData);
            if (!token.actor) {
                tokenData.actorId = null;
                tokenData.actorData = {};
            } else if (!tokenData.actorLink && token.data.actorData.items) {
                const update = migrateActorData(token.data.actorData, worldSchemaVersion);
                console.log("ACTOR CHANGED", token.data.actorData, update);
                tokenData.actorData = mergeObject(token.data.actorData, update);
            }
            return tokenData;
        }),
    };
};

export const migrateCompendium = async function (pack, worldSchemaVersion) {
    const entity = pack.metadata.entity;

    await pack.migrate();
    const content = await pack.getContent();

    for (let ent of content) {
        let updateData = {};
        if (entity === "Actor") {
            updateData = migrateActorData(ent.data, worldSchemaVersion);
        }
        if (!isObjectEmpty(updateData)) {
            expandObject(updateData);
            updateData["_id"] = ent._id;
            await pack.updateEntity(updateData);
        }
    }
};
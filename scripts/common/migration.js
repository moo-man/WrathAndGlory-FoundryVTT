export default class Migration {
    static stats = {};
    static MIGRATION_VERSION = "6.0.0"

    // #region High Level Migration Handling
    static async migrateWorld(update=false, updateVersion=false) {
        this.stats = {
            actors : {
                updated : 0,
                skipped : 0,
                error : [],
                total : 0,
                items : 0,
                effects : 0,
                itemEffects : 0
            },
            items : {
                updated : 0,
                skipped : 0,
                error : [],
                total : 0,
                effects : 0
            }
        }
        ui.notifications.notify(`>>> Initiated <strong>Wrath & Glory</strong> Version ${game.system.version} Migration <<<`);
        console.log(`%c+++++++++++++++++| Begin Migration of World Actors |+++++++++++++++++`, "color: #DDD;background: #065c63;font-weight:bold");
        for (let doc of game.actors.contents) 
        {
            this.stats.actors.total++;
            warhammer.utility.log(`+++| Actor: ${doc.name} |+++`, true, null, {groupCollapsed : true})
            try {
                let migration = await this.migrateActor(doc);
                if (!isEmpty(migration)) 
                {
                    this.stats.actors.updated++;
                    if (update)
                    {
                        await doc.update(migration);
                    }
                    warhammer.utility.log(`+++| Migration Data: `, true, migration)
                }
                else 
                {
                    this.stats.actors.skipped++;
                    warhammer.utility.log(`+++| Nothing to migrate for ${doc.name} |+++`, true)
                }
            }
            catch (e) {
                this.stats.actors.error.push(doc.name);
                warhammer.utility.error("+++| MIGRATION FAILED |+++ Error: " + e.stack, true, doc)
            }
            finally
            {
                console.groupEnd();
            }
        }

        console.log(`%c+++++++++++++++++| Begin Migration of World Items |+++++++++++++++++`, "color: #DDD;background: #065c63;font-weight:bold");
        for (let doc of game.items.contents) 
        {
            this.stats.items.total++;
            warhammer.utility.log(`+++| Item: ${doc.name} |+++`, true, null, {groupCollapsed : true})
            try {
                let migration = await this.migrateItem(doc);
                if (!isEmpty(migration)) 
                {
                    this.stats.items.updated++;
                    if (update)
                    {
                        await doc.update(migration);
                    }
                    warhammer.utility.log(`+++| Migration Data: `, true, migration)
                }
                else 
                {
                    this.stats.items.skipped++;
                    warhammer.utility.log(`+++| Nothing to migrate for ${doc.name} |+++`, true)
                }
            }
            catch (e) {
                this.stats.actors.error.push(doc.name);
                warhammer.utility.error("+++| MIGRATION FAILED |+++ Error: " + e, true, doc)
            }
            finally
            {
                console.groupEnd();
            }
        }

        console.log(`%c+++++++++++++++++| ${game.system.version} Migration Complete |+++++++++++++++++`, "color: #DDD;background: #065c63;font-weight:bold");
        this._printStatistics(this.stats)
        if (this.stats.actors.error.length || this.stats.items.error.length)
        {
            ui.notifications.warn(`>>> Migration Complete with ${this.stats.actors.error.length + this.stats.items.error.length} errors — See Console for details <<<`)
        }
        else 
        {
            ui.notifications.notify(`>>> Migration Complete — See Console for details <<<`)
        }
        if (updateVersion)
        {
            game.settings.set("wrath-and-glory", "systemMigrationVersion", game.system.version)
        }
    }

    static async migratePacks(update=false, {world=true, compendium=false}={})
    {
        this.stats = {
            actors : {
                updated : 0,
                skipped : 0,
                error : [],
                total : 0,
                items : 0,
                effects : 0,
                itemEffects : 0
            },
            items : {
                updated : 0,
                skipped : 0,
                error : [],
                total : 0,
                effects : 0
            }
        }

        for(let pack of game.packs)
        {
            if (world && pack.metadata.package == "world")
            {
                await this.migratePack(pack, update);
            }
            else if (compendium && pack.metadata.package != "world")
            {
                await this.migratePack(pack, update);
            }
        }

        this._printStatistics(this.stats)
    }

    static async migratePack(pack, update)
    {
        if (typeof pack == "string")
        {
            pack = game.packs.get(pack);
        }
        if (!["Actor", "Item"].includes(pack.metadata.type))
        {
            return
        }

        if (update && pack.locked)
        {
            console.error(`Skipping ${pack.metadata.label} - Locked`);
            return;
        }

        console.log(`%c+++++++++++++++++| Begin Migration of ${pack.metadata.label} |+++++++++++++++++`, "color: #DDD;background: #065c63;font-weight:bold");
        let documents = await pack.getDocuments();
        for(let doc of documents)
        {
            if (doc.documentName == "Actor")
            {
                this.stats.actors.total++;
                warhammer.utility.log(`+++| Actor: ${doc.name} |+++`, true, null, {groupCollapsed : true})
                try {
                    let migration = await this.migrateActor(doc);
                    if (!isEmpty(migration)) 
                    {
                        this.stats.actors.updated++;
                        if (update)
                        {
                            await doc.update(migration);
                        }
                        warhammer.utility.log(`+++| Migration Data: `, true, migration)
                    }
                    else 
                    {
                        this.stats.actors.skipped++;
                        warhammer.utility.log(`+++| Nothing to migrate for ${doc.name} |+++`, true)
                    }
                }
                catch (e) {
                    this.stats.actors.error.push(doc.name);
                    warhammer.utility.error("+++| MIGRATION FAILED |+++ Error: " + e.stack, true, doc)
                }
                finally
                {
                    console.groupEnd();
                }
            }
            if (doc.documentName == "Item")
            {
                this.stats.items.total++;
                warhammer.utility.log(`+++| Item: ${doc.name} |+++`, true, null, {groupCollapsed : true})
                try {
                    let migration = await this.migrateItem(doc);
                    if (!isEmpty(migration)) 
                    {
                        this.stats.items.updated++;
                        if (update)
                        {
                            await doc.update(migration);
                        }
                        warhammer.utility.log(`+++| Migration Data: `, true, migration)
                    }
                    else 
                    {
                        this.stats.items.skipped++;
                        warhammer.utility.log(`+++| Nothing to migrate for ${doc.name} |+++`, true)
                    }
                }
                catch (e) {
                    this.stats.actors.error.push(doc.name);
                    warhammer.utility.error("+++| MIGRATION FAILED |+++ Error: " + e, true, doc)
                }
                finally
                {
                    console.groupEnd();
                }
            }
        }
        console.log(`%c+++++++++++++++++| ${pack.metadata.label} Migration Complete |+++++++++++++++++`, "color: #DDD;background: #065c63;font-weight:bold");
    }

    static async migrateActor(actor) {
        let migration = {
            items : (await Promise.all(actor.items.map(i => this.migrateItem(i, actor)))).filter(i => !isEmpty(i)),
            effects: (await Promise.all(actor.effects.map(e => this.migrateEffect(e, actor)))).filter(i => !isEmpty(i))
        };

        foundry.utils.mergeObject(migration, await this.actorDataMigration(actor))

        this.stats.actors.items += migration.items.length;
        this.stats.actors.effects += migration.effects.length;

        if (actor.effects.size)
        {
            warhammer.utility.log(`\t|--- Migrated ${migration.effects.length} / ${actor.effects.size} Embedded Effects`, true)
        }
        if (actor.items.size)
        {
            warhammer.utility.log(`\t|--- Migrated ${migration.items.length} / ${actor.items.size} Embedded Items`, true)
        }

        if (migration.items.length == 0)
        {
            delete migration.items;
        }
        if (migration.effects.length == 0)
        {
            delete migration.effects;
        }
        if (!isEmpty(migration))
        {
            migration._id = actor._id;
        }
        return migration;
    }

    static async migrateItem(item, parent) {
        if (parent)
        {
            warhammer.utility.log(`\t|--- Embedded Item: ${item.name}`, true)
        }

        let migration = {
            effects: (await Promise.all(item.effects.map(e => this.migrateEffect(e, item)))).filter(e => !isEmpty(e))
        };

        if (parent)
        {
            this.stats.actors.itemEffects += migration.effects.length;
        }
        else 
        {
            this.stats.items.effects += migration.effects.length;
        }

        if (migration.effects.size)
        {
            warhammer.utility.log(`${parent ? '\t' : ""}\t|--- Migrated ${migration.effects.length} / ${actor.effects.size} Embedded Effects`, true)
        }

        foundry.utils.mergeObject(migration, await this.itemDataMigration(item))

        if (migration.effects.length == 0)
        {
            delete migration.effects;
        }

        if (!isEmpty(migration))
        {
            migration._id = item._id;
        }
        return migration;
    }

    static async migrateEffect(effect, parent) {
        warhammer.utility.log(`\t${parent.parent ? "\t" : ""}|--- Active Effect: ${effect.name}`, true)
        let migration = {};

        foundry.utils.mergeObject(migration, await this.effectDataMigration(effect))

        if (!isEmpty(migration))
        {
            migration._id = effect._id;
        }
        return migration;
    }
    //#endregion


    // #region Data Migrations
    static async actorDataMigration(actor)
    {
        let migrated = {}

        return migrated;
    }
    static async itemDataMigration(item)
    {
        let migrated = {}


        return migrated;
    }  
    static async effectDataMigration(effect)
    {
        let migrated = {}
        let applicationData = effect.getFlag("wrath-and-glory", "applicationData")
        if (applicationData)
        {
            let transferData = {
                type : applicationData.type,
                documentType : applicationData.documentType,
                avoidTest : applicationData.avoidTest,
                testIndependent : applicationData.testIndependent,
                preApplyScript : applicationData.preApplyScript,
                equipTransfer : applicationData.equipTransfer,
                enableConditionScript : applicationData.enableConditionScript,
                filter : applicationData.filter,
                prompt : applicationData.prompt,

                zone : {
                    type : applicationData.zoneType,
                    keep : applicationData.keep,
                    tarits : applicationData.traits
                }
            };
            setProperty(migrated, "system.transferData", transferData);
            migrated["flags.wrath-a.-=applicationData"] = null;
        }
        let scriptData = effect.getFlag("wrath-and-glory", "scriptData")
        if (scriptData)
        {
            setProperty(migrated, "system.scriptData", scriptData);
            migrated.system.scriptData.forEach(s => {
                s.script = s.script || s.string;
                s.options = s.options || {};
                foundry.utils.mergeObject(s.options, s.options.dialog)
                foundry.utils.mergeObject(s.options, s.options.immediate)
            })
            migrated["flags.impmal.-=scriptData"] = null;
        }
        return migrated;
    }  

    //#endregion

    //#region Utilities
    static shouldMigrate()
    {
        return false;
        let systemMigrationVersion = game.settings.get("wrath-and-glory", "systemMigrationVersion")

        return foundry.utils.isNewerVersion(this.MIGRATION_VERSION, systemMigrationVersion);
    }

    static _printStatistics(stats)
    {
        let errors = stats.actors.error.length + stats.items.error.length;
        warhammer.utility.log(`Migration Statistics ${errors > 0 ? "(" + errors + " Errors)" : ""}`, true, stats, {groupCollapsed : true})
        warhammer.utility.log(`Actors - Updated: ${stats.actors.updated}; Skipped: ${stats.actors.skipped}; Error: ${stats.actors.error.length} ${stats.actors.error.length ? "(" + stats.actors.error.join(", ") + ")" : ""}`, true)
        warhammer.utility.log(`Items - Updated: ${stats.items.updated}; Skipped: ${stats.items.skipped}; Error: ${stats.items.error.length} ${stats.items.error.length ? "(" + stats.items.error.join(", ") + ")" : ""}`, true)
        console.groupEnd();
    }
    //#endregion
}

Hooks.on("ready", () => 
{
    if(game.wng.migration.shouldMigrate())
    {
        game.wng.migration.migrateWorld(true, true);
    }
});
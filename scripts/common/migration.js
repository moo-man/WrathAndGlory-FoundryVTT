import { StandardWNGActorModel } from "../model/actor/components/standard";

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
        console.log(`%c+++++++++++++++++| Begin Migration of World Actors |+++++++++++++++++`, "color: #DDD;background: #8a2e2a;font-weight:bold");
        for (let doc of game.actors.contents) 
        {
            this.stats.actors.total++;
            warhammer.utility.log(`+++| Actor: ${doc.name} |+++`, true, null, {groupCollapsed : true})
            try {
                let migration = await this.migrateActor(doc);
                let didMigrate = await this.migrateActorEffectRefactor(doc);
                if (!isEmpty(migration) || didMigrate) 
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

        console.log(`%c+++++++++++++++++| Begin Migration of World Items |+++++++++++++++++`, "color: #DDD;background: #8a2e2a;font-weight:bold");
        for (let doc of game.items.contents) 
        {
            this.stats.items.total++;
            warhammer.utility.log(`+++| Item: ${doc.name} |+++`, true, null, {groupCollapsed : true})
            try {
                let migration = await this.migrateItem(doc);
                let didMigrate = await this.migrateItemEffectRefactor(doc);
                if (!isEmpty(migration) || didMigrate) 
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

        console.log(`%c+++++++++++++++++| ${game.system.version} Migration Complete |+++++++++++++++++`, "color: #DDD;background: #8a2e2a;font-weight:bold");
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

        console.log(`%c+++++++++++++++++| Begin Migration of ${pack.metadata.label} |+++++++++++++++++`, "color: #DDD;background: #8a2e2a;font-weight:bold");
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
        console.log(`%c+++++++++++++++++| ${pack.metadata.label} Migration Complete |+++++++++++++++++`, "color: #DDD;background: #8a2e2a;font-weight:bold");
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

        if (!isEmpty(migration)) {
            migration._id = effect._id;
        }
        return migration;
    }
    //#endregion


    // #region Data Migrations
    static async actorDataMigration(actor) {
        let migrated = {}

        if (actor.system instanceof StandardWNGActorModel) {

            let faction = actor.itemTypes.faction[0];
            let species = actor.itemTypes.species[0];
            let archetype = actor.itemTypes.archetype[0];

            if (faction) 
            {
                foundry.utils.setProperty(migrated, "system.faction.id", faction.id);
            }
            if (species) 
            {
                foundry.utils.setProperty(migrated, "system.species.id", species.id);
            }
            if (archetype) 
            {
                foundry.utils.setProperty(migrated, "system.archetype.id", archetype.id);
            }

            if (faction)
            {
                foundry.utils.setProperty(migrated, "system.bio.origin", faction.system.backgrounds.origin.find(i => i.active)?.description || "");
                foundry.utils.setProperty(migrated, "system.bio.accomplishment", faction.system.backgrounds.accomplishment.find(i => i.active)?.description || "");
                foundry.utils.setProperty(migrated, "system.bio.goal", faction.system.backgrounds.goal.find(i => i.active)?.description || "");
            }
        }

        return migrated;
    }
    static async itemDataMigration(item)
    {
        let migrated = {}

        if (item.type == "weapon")
        {
            
        }

        if (item.type == "faction" && item.actor)
        {
            let factionEffectOnActor = item.actor.effects.find(i => i.sourceName == item.name);

            let factionEffectOnItem = item.effects.contents.find(e => e.name == factionEffectOnActor?.name)
            if (factionEffectOnItem)
            {
                let backgrounds = item.system.toObject().backgrounds;
                let foundBG = backgrounds.origin.concat(backgrounds.accomplishment).concat(backgrounds.goal).find(bg => bg.effect.id == factionEffectOnItem?.id);
                if (foundBG)
                {
                    foundBG.chosen = true;
                    foundry.utils.setProperty(migrated, "system.backgrounds", backgrounds)
                }
            }
        }

        if (item.type == "archetype")
        {
            this._migrateReference(item, "species", migrated)
            this._migrateReference(item, "faction", migrated)
            this._migrateReference(item, "ability", migrated)
            this._migrateReferenceList(item, "suggested.talents", migrated);
        }

        if (item.type == "species")
        {
            this._migrateReferenceList(item, "abilities", migrated);
        }

        return migrated;
    }  
    static async effectDataMigration(effect)
    {
        let migrated = {}
        
        return migrated;
    }  



    static async migrateActorEffectRefactor(actor)
    {
        let effectsToDelete = [];
        let migrated = false;

        for(let effect of actor.effects)
        {
            let originItem = await fromUuid(actor.pack ? `Compendium.${actor.pack}.${effect.origin}` : effect.origin);
            if (originItem)
            {
                let originEffect = originItem.effects.getName(effect.name);
                if (originEffect)
                {
                    let effectData = effect.toObject();
                    effectData.transfer = originEffect.transfer;
                    originEffect.update(this.migrateEffectRefactor(effectData, effect));
                    effectsToDelete.push(effect.id);
                }
            }
        }
        if (effectsToDelete.length)
        {
            migrated = true;
            await actor.deleteEmbeddedDocuments("ActiveEffect", effectsToDelete);
        }
        for(let item of actor.items)
        {
            if (await this.migrateItemEffectRefactor(item))
            {
                migrated = true;
            }
        }
        return migrated;
    }

    static async migrateItemEffectRefactor(item)
    {
        for(let effect of item.effects)
        {
            let migratedEffect = this.migrateEffectRefactor(effect.toObject(), effect)
            if (!isEmpty(migratedEffect))
            {
                await effect.update(migratedEffect);
                return true;
            }
            else return false;
        }
    }

    static migrateEffectRefactor(data, document)
    {
        let changes = data?.changes || [];
        let migrateScripts = false;
        if (changes.some(c => c.mode == 6 || c.mode == 7) || data.system?.scriptData?.length == 0)
        {
            migrateScripts = true;
        }

        if (document.parent.documentName == "Item" && !document.getFlag("wrath-and-glory", "migrated"))
        {
            if (data.transfer == false && document.parent.type != "ammo")
            {
                setProperty(data, "system.transferData.type", "target");
            }
            if (document.parent.type == "ammo")
            {
                setProperty(data, "system.transferData.type", "document");
                setProperty(data, "system.transferData.documentType", "Item");

            }
            setProperty(data, "flags.wrath-and-glory.migrated", true);
        }

        if (document.parent.documentName == "Item" && document.parent.type == "psychicPower" && data.system?.transferData?.type == "document")
        {
            setProperty(data, "system.transferData.type", "target");
        }
    
        if (migrateScripts) 
        {
            let scriptData = []

            let changeConditon = foundry.utils.getProperty(data, "flags.wrath-and-glory.changeCondition");
            for (let i in changeConditon) {
                if (changes[i]?.mode >= 6) {
                    let script;

                    if (changes[i].value === "true" || changes[i].value === "false") {
                        script = `args.fields.${changes[i].key.split("-").map((i, index) => index > 0 ? i.capitalize() : i).join("")} = ${changes[i].value}`
                    }
                    else if (changes[i].value.includes("@") && !changes[i].value.includes("@test"))
                    {
                        script = `args.fields.${changes[i].key.split("-").map((i, index) => index > 0 ? i.capitalize() : i).join("")} += (${changes[i].value.replace("@", "args.actor.system.")})`
                    }
                    else {
                        script = `args.fields.${changes[i].key.split("-").map((i, index) => index > 0 ? i.capitalize() : i).join("")} += (${changes[i].value})`
                    }
                    scriptData.push({
                        trigger: "dialog",
                        label: changeConditon[i].description,
                        script: script,
                        options: {
                            targeter: changes[i].mode == 7,
                            activateScript: changeConditon[i].script,
                            hideScript: changeConditon[i].hide
                        }
                    })
                }
            }

            const convertScript = (str = "") => {
                str = str.replaceAll("@test", "this.effect.sourceTest");
                str = str.replaceAll("data.", "args.");
                str = str.replaceAll("pool.bonus", "pool");
                str = str.replaceAll("difficulty.bonus", "difficulty");
                str = str.replaceAll("ed.bonus", "ed.value");
                str = str.replaceAll("ap.bonus", "ap.value");
                str = str.replaceAll("damage.bonus", "damage");
                str = str.replaceAll("damage.other.shock.bonus", "damage.other.shock");
                return str;
            }


            for (let newScript of scriptData) {
                newScript.script = convertScript(newScript.script);
                newScript.options.hideScript = convertScript(newScript.options.hideScript);
                newScript.options.activateScript = convertScript(newScript.options.activateScript);
                newScript.options.submissionScript = convertScript(newScript.options.submissionScript);
            }



            data.changes = data.changes.filter(i => i.mode < 6);
            setProperty(data, "system.scriptData", scriptData)
        }
        return data;
    }


    static async _migrateReference(document, field, migration)
    {
        let property = foundry.utils.getProperty(document.system, field);
        if (!property || property.uuid)
        {
            return;
        }
        if (property.id)
        {
            let uuid = warhammer.utility.findUuid(property.id);

            if (uuid)
            {
                foundry.utils.setProperty(migration, `system.${field}`, {uuid, id : property.id, name : property.name});
            }
        }
    }

    static async _migrateReferenceList(document, field, migration)
    {
        let property = foundry.utils.getProperty(document.system, field);
        if (property?.list)
        {
            let migratedList = property.list.map(i => {
                return {
                    id : i.id,
                    uuid : warhammer.utility.findUuid(i.id),
                    name : i.name
                }
            })
            foundry.utils.setProperty(migration, `system.${field}.list`, migratedList);
        }
    }




    //#endregion

    //#region Utilities
    
    static shouldMigrate()
    {
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
        ChatMessage.create({content : `
        <h2>The Effect Refactor Arrives</h2>
        <p>If (and only if) you are updating from <strong>Wrath & Glory</strong> version 5.1.7 (or earlier), effects have been vastly improved with the integration of th <strong>Warhammer Library</strong>. However, this means that your Actors/Items in the world are out of date and don't utilize these new features.</p>
        <p>It is recommended that your important Actors (notably player characters) replace their Talents, Powers, Upgrades, etc. fresh from the Compendium. <strong>Note</strong>: Implementing these effects is an ongoing process, while a great many Items from the preimum modules have been updated, there may be some that have not received attention and haven't been updated.</p>
        <p>If you have questions, please utilize the <a href="https://discord.gg/foundryvtt">Discord</a> channels where I or other community members will be happy to answer your questions. Thanks!</p>
        `})
        game.wng.migration.migrateWorld(true, true);
    }
});
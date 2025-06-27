import { WNGTest } from "../common/tests/test.js";
import WeaponTest from "../common/tests/weapon-test.js";
import PowerTest from "../common/tests/power-test.js";
import CorruptionTest from "../common/tests/corruption-test.js";
import MutationTest from "../common/tests/mutation-test.js";
import ResolveTest from "../common/tests/resolve-test.js";
import DeterminationRoll from "../common/tests/determination.js";
import AbilityRoll from "../common/tests/ability-roll.js";
import StealthRoll from "../common/tests/stealth.js";
import CharacterCreation from "../apps/character-creation.js";
import { RollDialog } from "../common/dialogs/base-dialog.js";
import { WeaponDialog } from "../common/dialogs/weapon-dialog.js";
import { PowerDialog } from "../common/dialogs/power-dialog.js";
import { CommonDialog } from "../common/dialogs/common-dialog.js";

export class WrathAndGloryActor extends WarhammerActor {

    prepareBaseData() {
        this.derivedEffects = [];
        super.prepareBaseData();
        this.keywords = new Set(this.itemTypes.keyword.map(i => i.name));
    }

    prepareDerivedData()
    {
        this._applyDerivedEffects();
        super.prepareDerivedData();
    }

        
    _applyDerivedEffects() {
        this.derivedEffects.forEach(change => {
            change.effect.fillDerivedData(this, change)
            change.effect.apply(this, change);
        })
    }

    async _onUpdate(data, options, user)
    {
        await super._onUpdate(data, options, user);
        if (options.deltaWounds > 0)
        {
            TokenHelpers.displayScrollingText("+" + options.deltaWounds, this, {fill: "0xFF0000", direction : CONST.TEXT_ANCHOR_POINTS.TOP});
        }
        else if (options.deltaWounds < 0)
        {
            TokenHelpers.displayScrollingText(options.deltaWounds, this, {fill: "0x00FF00", direction : CONST.TEXT_ANCHOR_POINTS.BOTTOM});
        }
    
        if (options.deltaShock > 0)
        {
            TokenHelpers.displayScrollingText("+" + options.deltaShock, this, {fill: "0x6666FF", direction : CONST.TEXT_ANCHOR_POINTS.TOP});
        }
        else if (options.deltaShock < 0)
        {
            TokenHelpers.displayScrollingText(options.deltaShock, this, {fill: "0x6666FF", direction : CONST.TEXT_ANCHOR_POINTS.BOTTOM});
        }
    }

    //#region Rolling
    async setupAttributeTest(attribute, context = {}, options = {}) {
        return this._setupTest(CommonDialog, WNGTest, {attribute}, context, options)
    }

    async setupSkillTest(skill, context = {}, options = {}) {
        return this._setupTest(CommonDialog, WNGTest, {skill}, context, options)
    }

    async setupGenericTest(type, context = {}, options = {}) {
        context = foundry.utils.mergeObject(context, {fields : {}, [type] : true})
        
        if (type == "conviction")
        {
            type = await foundry.applications.api.Dialog.wait({
                window : {title : game.i18n.localize(`ROLL.CONVICTION`)},
                buttons : [
                    {
                        action : "corruption",
                        label : `ROLL.CORRUPTION`
                    },
                    {
                        action : "mutation",
                        label : `ROLL.MUTATION`
                    }
                ]
            });
        }

        if (type == "resolve")
        {
            type = await foundry.applications.api.Dialog.wait({
                window : {title : game.i18n.localize(`ROLL.RESOLVE`)},
                buttons : [
                    {
                        action : "fear",
                        label : `ROLL.FEAR`,
                        callback: () => {}
                    },
                    {
                        action : "terror",
                        label : `ROLL.TERROR`,
                        callback: () => {}
                    }
                ]
            });
        }

        switch (type) {
            case "stealth":
                context.title = game.i18n.localize(`ROLL.STEALTH`);
                context.noDn = true;
                context.noWrath = true;
                return this._setupTest(CommonDialog, StealthRoll, {skill: "stealth"}, context, options)
            case "determination":
                context.title = game.i18n.localize(`ROLL.DETERMINATION`)
                context.noDn = true;
                context.noWrath = true;
                options.resolveClose = true;
                return this._setupTest(CommonDialog, DeterminationRoll, {pool : this.system.combat.determination.total,}, context, options)
            case "corruption":
                context.title = game.i18n.localize(`ROLL.CORRUPTION`)
                context.corruption = true;
                context.conviction = true;
                return this._setupTest(CommonDialog, CorruptionTest, {pool : this.system.combat.conviction.total}, context, options)
            case "mutation":
                context.title = game.i18n.localize(`ROLL.MUTATION`)
                context.mutation = true;
                context.conviction = true;
                return this._setupTest(CommonDialog, MutationTest, {pool : this.system.combat.conviction.total}, context, options)
            case "fear":
                context.title = game.i18n.localize(`ROLL.FEAR`)
                context.fear = true;
                context.resolve = true;
                context.noWrath = true;
                return this._setupTest(CommonDialog, ResolveTest, {pool : this.system.combat.resolve.total}, context, options)
            case "terror":
                context.title = game.i18n.localize(`ROLL.TERROR`)
                context.terror = true;
                context.resolve = true;
                context.noWrath = true;
                return this._setupTest(CommonDialog, ResolveTest, {pool : this.system.combat.resolve.total}, context, options)
            case "influence":
                context.fields.pool = this.resources.influence
                context.title = game.i18n.localize(`ROLL.INFLUENCE`)
                context.noWrath = true;
                return this._setupTest(CommonDialog, ResolveTest, {pool : this.system.resources.influence}, context, options)
            default:
                throw new Error("Unknown roll type: " + type)
        }
    }

    async setupWeaponTest(weapon, context={}, options)
    {
        if (game.user.targets.size > 1)
        {
            return Promise.all(game.user.targets.map(i => {
                let contextCopy = foundry.utils.deepClone(context);
                contextCopy.targets = [i];
                contextCopy.multi = game.user.targets.size;
                return this._setupTest(WeaponDialog, WeaponTest, weapon, contextCopy, options);
            }))
        }
        else 
        {
            return this._setupTest(WeaponDialog, WeaponTest, weapon, context, options);
        }
    }

    async setupPowerTest(power, context = {}, options) 
    {
        if (typeof power == "string")
        {
            power = this.items.get(power) || await fromUuid(power)
        }

        if (game.user.targets.size > 1 && power.system.multiTarget)
        {
            return Promise.all(game.user.targets.map(i => {
                let contextCopy = foundry.utils.deepClone(context);
                contextCopy.targets = [i];
                contextCopy.multi = game.user.targets.size;
                return this._setupTest(PowerDialog, PowerTest, power, contextCopy, options);
            }))
        }
        else 
        {
            return this._setupTest(PowerDialog, PowerTest, power, context, options);
        }
    }

    async setupAbilityRoll(ability, context = {}, options) {
        if (typeof ability == "string")
        {
            ability = this.items.get(ability) || await fromUuid(ability);
        }
      
        
        
        let testData = {
            title: ability.name,
            speaker: this.speakerData(),
            item: ability,
        }

        if (ability.system.abilityType == "determination")
        {
            return this.setupGenericTest("determination", context, options)
        }

        if (ability.system.test.self)
        {
            return this.setupTestFromItem(ability, {item : ability}, options);
        }

        if (this.type == "threat" && ability.type == "ability" && ability.system.cost)
        {
            if (!(await this.spend("system.resources.ruin", ability.system.cost || 0)))
            {
                if (game.counter.ruin > 0)
                {
                    game.wng.RuinGloryCounter.changeCounter(-1, "ruin");
                    ui.notifications.notify(`<strong>${ability.name}</strong>: Spent ${ability.system.cost} Ruin (Counter)`)
                }
                else 
                {
                    ui.notifications.error(`<strong>${ability.name}</strong>: Not enough Ruin!`)
                    return;
                }
            }
            else 
            {
                ui.notifications.notify(`<strong>${ability.name}</strong>: Spent ${ability.system.cost} Ruin (Personal)`)
            }
        }
        
        ui.sidebar.activateTab("chat")
        let roll = new AbilityRoll(testData)
        await roll.rollTest();
        roll.sendToChat();
    }

    async setupTestFromItem(item, context, options)
    {
        if (typeof item == "string")
        {
            item = await fromUuid(item);
        }

        if (item)
        {
            context.appendTitle = ` - ${item.name}`;
            return this.setupTestFromData(item.system.test, context, options);
        }
    }

    async setupTestFromData(data, context={}, options)
    {
        let dn = data.dn;
        let type = data.type;
        let specification = data.specification;
        foundry.utils.setProperty(context, "fields.difficulty", dn);
        
        if (type == "attribute")
        {
            return this.setupAttributeTest(specification, context, options)
        }
        else if (type == "skill")
        {       
            return this.setupSkillTest(specification, context, options)
        }
        else if (type == "resolve")
        {
            return this.setupGenericTest(specification, context, options)
        }
        else if (type == "corruption")
        {
            return this.setupGenericTest(specification, context, options)
        }
    }

    async rollDetermination(wounds, message)
    {
        if (this.statuses.has("exhausted"))
        {
            return;
        }
        let test = await this.setupGenericTest("determination", {message, fields: {wounds}});
        return test;
    }

    async characterCreation(archetype) {
        if (await foundry.applications.api.Dialog.confirm({
            window: {title: "Character Creation"},
            content: "<p>Begin Character Creation?</p>",
        }))
        {
            new CharacterCreation({ actor: this, archetype }).render(true)
        }
        else 
        {
            let species = await warhammer.utility.findItemId(archetype.species.id, "species")
            let faction = await warhammer.utility.findItemId(archetype.faction.id, "faction")
            this.createEmbeddedDocuments("Item", [archetype.toObject(), faction?.toObject(), species?.toObject()].filter(i => i))
        }
    }

    async applyArchetype(archetype, apply) {

        if (this.type == "agent" && apply) // If agent, start character creation
        {
            new CharacterCreation({ actor: this, archetype }).render(true)
        }
        else if (this.type == "threat" && apply) // If threat, apply archetype statistics
        {
            ui.notifications.info(`Applying ${archetype.name} Archetype`)
            let actorData = this.toObject();

            let items = await archetype.GetArchetypeItems()
            let faction = items.find(i => i.type == "faction")
            let species = items.find(i => i.type == "species")
            faction.effects = [];
            actorData.system.combat.speed = species.system.speed;
            actorData.system.combat.size = species.system.size;


            for(let attr in archetype.attributes)
            {
                let attribute = actorData.system.attributes[attr]
                if (archetype.attributes[attr])
                    attribute.base = archetype.attributes[attr]

                if (archetype.suggested.attributes[attr] > attribute.base)
                    attribute.rating = archetype.suggested.attributes[attr] - attribute.base
            }

            for(let sk in archetype.skills)
            {
                let skill = actorData.system.skills[sk]
                if (archetype.skills[sk])
                    skill.base = archetype.skills[sk]

                if (archetype.suggested.skills[sk] > skill.base)
                    skill.rating = archetype.suggested.skills[sk] - skill.base
            }


            // Remove IDs so items work within the update method
            items.forEach(i => delete i._id)

            actorData.name = archetype.name;
            actorData.img = archetype.img;
            actorData.prototypeToken.texture.src = archetype.img.replace("images", "tokens").replace("actors", "tokens")

            await this.update(actorData)

            // Add items separately so active effects get added seamlessly
            this.createEmbeddedDocuments("Item", items, {appliedArchetype : true})
        }
    }

    async applyDamage(damage=0, {ap=0, shock=0, mortal=0}, {test, damageRoll, token, allowDetermination=true}={}) {

        if (!this.statuses.has("full-defence") && test && test.weapon && (test.weapon.traitList.blast || test.weapon.traitList.flamer))
        {
            if (await foundry.applications.api.Dialog.confirm({
                window: { title : "Full Defence"},
                content : `<p>Dodge Area of Effect?</p>`
            }))
            {
                await this.addCondition("full-defence", {}, {resilience : true})
            }

        }

        let resilience = foundry.utils.deepClone(this.system.combat.resilience)
        let res = resilience.total || 1
        ap = Math.abs(ap);

        token = token || this.prototypeToken;

        // label, value, description
        let modifiers = {
            damage : [],
            ap : [],
            shock: [],
            mortal: [],
            resilience : [],
            wounds : [],
        };

        let addModifierBreakdown = (type, label) => {
            for(let mod of modifiers[type])
            {
                report.breakdown.push(`<strong>${mod.label}</strong>: ${HandlebarsHelpers.numberFormat(mod.value, { hash: { sign: true } })} ${label}` + (mod.description ? ` (${mod.description})` : ""))
            }
        }
        
        let mortalDetermination = false;
        let args = {damage, ap, shock, mortal, test, damageRoll, modifiers, resilience, actor: this}
        this.runScripts("preTakeDamage", args)
        test?.actor?.runScripts("preApplyDamage", args)
        test?.item?.runScripts("preApplyDamage", args)
        damage = args.damage;
        ap = args.ap;
        shock = args.shock;
        mortal = args.mortal;
        mortalDetermination = args.mortalDetermination;
        
        let invuln = resilience.invulnerable
        if (resilience.powerField)
        {
            mortalDetermination = true;
        }

        let wounds = 0

        let report = {
            message : null,
            breakdown : [],
            uuid : token?.uuid
        }

        if (args.abort)
        {
            report.message = game.i18n.format(`<strong>${token?.name}</strong> received no damage`);
            report.breakdown = `<p>${args.abort}</p>`
            return report;
        }

        damage += modifiers.damage.reduce((acc, mod) => acc + mod.value, 0);
        ap += modifiers.ap.reduce((acc, mod) => acc + mod.value, 0);
        mortal += modifiers.mortal.reduce((acc, mod) => acc + mod.value, 0);

        if (invuln)
        {
            ap = 0;
        }
    
        if (ap)
        {
            let resilienceReduction = ap
            if (game.settings.get('wrath-and-glory', 'advancedArmour') && this.type != "vehicle")
            {
                resilienceReduction = Math.min(ap, resilience.armour || 0)
            }
            addModifierBreakdown("ap", "AP");
            report.breakdown.push(`<strong>AP</strong>: Reduced Resilience to ${Math.max(0, res - resilienceReduction)} (${res} - ${resilienceReduction})`)
            res = Math.max(0, res - resilienceReduction);
        }
        else  if (invuln)
        {
            report.breakdown.push(`<strong>Invulnerable</strong>: Ignore AP`);
        }
    
        if (res <= 0)
            res = 1
    
        if (damage)
        {
            addModifierBreakdown("damage", "Damage");
            if (res > damage)
            {
                report.message = game.i18n.format("NOTE.APPLY_DAMAGE_RESIST", {name : token?.name})
                report.breakdown.push(`<strong>Resilience</strong>: Resisted ${damage} Damage`)
                report.resisted = true;
            }
        
            if (res == damage)
            {
                report.breakdown.push(`<strong>Resilience</strong>: Suffered 1 Shock (${res} vs. ${damage} Damage)`)
                shock++
            }
            if (res < damage)
            {
                wounds = damage - res
                report.breakdown.push(`<strong>Resilience</strong>: ${damage} Damage reduced to ${wounds} Wounds (-${res})`)
            }
        }

        if (mortal)
        {
            addModifierBreakdown("mortal", "Mortal Wounds");
            report.breakdown.push(`<strong>Mortal Wounds</strong>: ${mortal}`)
            if (mortalDetermination)
            {
                report.breakdown.push(`<strong>Mortal Wounds</strong>: ${mortal} converted to Wounds (${wounds + mortal})`);
                wounds += mortal;
                mortal = 0;
            }
        }

        if (this.type != "vehicle")
        {
            if (wounds && allowDetermination) 
            {
                let determination = await this.rollDetermination(wounds, damageRoll?.message?.id)
                if (determination) {
                    wounds = determination.result.wounds;
                    shock += determination.result.shock;
                    if (determination.result.shockIgnored) {
                        report.breakdown.push(`<strong>Determination</strong>: Ignored ${determination.result.converted} Wounds`)
                    }
                    else {
                        report.breakdown.push(`<strong>Determination</strong>: Converted ${determination.result.converted} Wounds to Shock`)
                    }
                    report.determination = determination;
                }
            }

            if (shock && (this.hasCondition("exhausted"))) 
            {
                mortal += shock;
                shock = 0;
                report.breakdown.push(`<strong>Exhausted</strong>: ${shock} Shock converted to Mortal Wounds (${mortal})`);
            }
        }


        let updateObj = {}
        args = {wounds, shock, mortal, report, updateObj, actor: this, test, damageRoll}
        this.runScripts("takeDamage", args)
        test?.actor?.runScripts("applyDamage", args)
        test?.item?.runScripts("applyDamage", args)

        // If you want to modify wounds before determination, use damage modifier
        // modifier.wounds is for modifying wounds after determination
        wounds += modifiers.wounds.reduce((acc, mod) => acc + mod.value, 0);
        shock += modifiers.shock.reduce((acc, mod) => acc + mod.value, 0);
        addModifierBreakdown("shock", "Shock");
        addModifierBreakdown("wounds", "Wounds");


        shock = Math.max(shock, 0);
        wounds = Math.max(wounds, 0);
        mortal = Math.max(mortal, 0);

        if (this.isMob && test)
        {
            // How many of the mob is hit
            let mobHit = 1 + Math.max(0, test.result.success - test.result.dn);

            // How much to reduce the mob by
            let mobDamage = 0;

            // If wounds inflicted, all mobs that were hit die
            if (wounds + mortal > 0)
            {
                mobDamage += mobHit;
            }

            // If shock inflicted is greater than a mob member has, all mobs that were hit die
            if (shock && shock > this.system.combat.shock.max)
            {
                mobDamage += mobHit
            }

            updateObj["system.mob.value"] = this.system.mob.value - mobDamage
            if (mobDamage >= this.system.mob.value)
            {
                await this.addCondition("dead");
            }
            report.breakdown.push(`<strong>Mob</strong>: Reduced by ${mobDamage}`);
        }
        
        if (shock > 0 && this.type != "vehicle" && !this.isMob)
        {
            let newShock = this.system.combat.shock.value + shock
            updateObj["system.combat.shock.value"] = newShock;
            if (newShock > this.system.combat.shock.max)
            {
                await this.addCondition("exhausted")
            }
        }
        if ((wounds > 0 || mortal > 0) && !this.isMob)
        {
            let newWounds = this.system.combat.wounds.value + wounds + mortal;
            updateObj["system.combat.wounds.value"] = newWounds;
            if (newWounds > this.system.combat.wounds.max)
            {
                await this.addCondition("dying")
            }
        }


        let applyDamageEffects = false
        if (shock + wounds + mortal > 0 && !args.abort) // if shock or wounds or mortal
        {
            report.breakdown.push(game.i18n.format("NOTE.APPLY_DAMAGE", {wounds : wounds + mortal, shock, name : token?.name}));
            report.message = game.i18n.format(`<strong>${token?.name}</strong> received damage`);
            applyDamageEffects = true;
        }
        else 
        {
            report.message = game.i18n.format(`<strong>${token?.name}</strong> received no damage`);
        }

        if (args.abort)
        {
            report.breakdown = `<p>${args.abort}</p>`
        }
        else 
        {
            report.breakdown = `<ul><li><p>${report.breakdown.join(`</p></li><li><p>`)}</p></li></ul>`
        }
    
        report.wounds = wounds + mortal;
        report.mortal = mortal;
        report.shock = shock;
        if (!args.abort)
        {
            await this.update(updateObj);
        }
        else if (args.abort) 
        {
            return report;
        }

        let damageEffects = test?.damageEffects || []
        if (damageEffects.length && applyDamageEffects)
        {
            this.applyEffect({effects : damageEffects, messageId : test.message.id})
        }

        return report;
    }

    applyHealing({wounds=0, shock=0}, {messageData={}, suppressMessage=false})
    {
        let newWounds = this.system.combat.wounds.value - wounds;
        let newShock = this.system.combat.shock.value - shock;

        this.update({"system.combat.wounds.value" : newWounds, "system.combat.shock.value" : newShock});
        
        let token = this.getActiveTokens()[0];
        let name = token ? token.name : this.prototypeToken.name;
        let content = `${name} healed ${[shock ? (shock + " Shock") : null, wounds ? (wounds + " Wounds") : null].filter(i => i).join(" and ")}`;
        if (!suppressMessage)
        {
            ChatMessage.create(foundry.utils.mergeObject({content, speaker : {alias : name}, flavor : "Healing"}, messageData));
        }
        return {shock : newShock, wounds : newWounds}
    }
    

    //#endregion

    get Size() {
        switch (this.system.combat.size) {
            case "tiny":
                return game.i18n.localize("SIZE.TINY");
            case "small":
                return game.i18n.localize("SIZE.SMALL");
            case "average":
                return game.i18n.localize("SIZE.AVERAGE");
            case "large":
                return game.i18n.localize("SIZE.LARGE");
            case "huge":
                return game.i18n.localize("SIZE.HUGE");
            case "gargantuan":
                return game.i18n.localize("SIZE.GARGANTUAN");
            default:
                return game.i18n.localize("SIZE.AVERAGE");
        }
    }

    get corruptionLevel() {
        let levels = Object.values(game.wng.config.corruptionLevels)
        return levels.findIndex(i => this.corruption.current >= i.range[0] && this.corruption.current <= i.range[1])
    }

    get isMob() {
        return this.type == "threat" && this.mob > 1
    }

    async addCondition(effect, flags = {}, options={}) {
        if (typeof (effect) === "string")
            effect = duplicate(CONFIG.statusEffects.concat(Object.values(game.wng.config.systemEffects)).find(e => e.id == effect))
        if (!effect)
            return "No Effect Found"

        if (!effect.id)
            return "Conditions require an id field"

        if (!effect.flags)
            effect.flags = flags
        else
            mergeObject(effect.flags, flags);

        let existing = this.hasCondition(effect.id)

        if (effect.id == "dying")
            await this.addCondition("prone")

        if (!existing) {
            effect.name = game.i18n.localize(effect.name)
            return this.createEmbeddedDocuments("ActiveEffect", [effect], foundry.utils.mergeObject(options, {condition: true}))
        }
    }

    async removeCondition(effect, value = 1) {
        if (typeof (effect) === "string")
            effect = duplicate(CONFIG.statusEffects.concat(Object.values(game.wng.config.systemEffects)).find(e => e.id == effect))
        if (!effect)
            return "No Effect Found"

        if (!effect.id)
            return "Conditions require an id field"

        let existing = this.hasCondition(effect.id)

        if (existing) {
            return existing.delete()
        }
    }

    get archetype() { return this.itemTypes.archetype[0] }
    get species() { return this.itemTypes.species[0] }
    get faction() { return this.itemTypes.faction[0] }

    hasCondition(conditionKey) {
        let existing = this.effects.find(e => e.statuses.has(conditionKey))
        return existing
    }


    hasKeyword(keyword) 
    {
        if (typeof keyword == "string")
        {
            keyword = [keyword];
        }

        return keyword.some(k => this.keywords.has(k));
    }


    get attributes() { return this.system.attributes }
    get skills() { return this.system.skills }
    get combat() { return this.system.combat }
    get bio() { return this.system.bio }
    get advances() { return this.system.advances }
    get experience() { return this.system.experience }
    get resources() { return this.system.resources }
    get corruption() { return this.system.corruption }
    get notes() { return this.system.notes }
    get mob() { return this.system.mob.value }

    get traitsAvailable() {
        if (this.type == "vehicle")
            return game.wng.config.vehicleTraits
    }

    _itemTypes = null;

    get itemTypes()
    {
      if (!this._itemTypes)
      {
        this._itemTypes = super.itemTypes;
      }
      return this._itemTypes
    }
  

    getAttributeCosts(rating) {
        switch (rating) {
            case 1:
                return 0;
            case 2:
                return 4;
            case 3:
                return 10;
            case 4:
                return 20;
            case 5:
                return 35;
            case 6:
                return 55;
            case 7:
                return 80;
            case 8:
                return 110;
            case 9:
                return 145;
            case 10:
                return 185;
            case 11:
                return 230;
            case 12:
                return 280;
            default:
                return 0;
        }
    }

    getSkillsCosts(rating) {
        switch (rating) {
            case 1:
                return 2;
            case 2:
                return 6;
            case 3:
                return 12;
            case 4:
                return 20;
            case 5:
                return 30;
            case 6:
                return 42;
            case 7:
                return 56;
            case 8:
                return 72;
            default:
                return 0;
        }
    }


    /**
* Transform the Document data to be stored in a Compendium pack.
* Remove any features of the data which are world-specific.
* This function is asynchronous in case any complex operations are required prior to exporting.
* @param {CompendiumCollection} [pack]   A specific pack being exported to
* @return {object}                       A data object of cleaned data suitable for compendium import
* @memberof ClientDocumentMixin#
* @override - Retain ID
*/
    toCompendium(pack) {
        let data = super.toCompendium(pack)
        data._id = this.id; // Replace deleted ID so it is preserved
        return data;
    }

}

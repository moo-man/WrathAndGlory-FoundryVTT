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
        this.derivedEffects = []
        super.prepareBaseData();
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
    async setupAttributeTest(attribute, options = {}) {
        return this._setupTest(CommonDialog, WNGTest, {attribute}, options)
    }

    async setupSkillTest(skill, options = {}) {
        return this._setupTest(CommonDialog, WNGTest, {skill}, options)
    }

    async setupGenericTest(type, options = {}) {
        options = foundry.utils.mergeObject(options, {fields : {}, [type] : true})
        
        if (type == "conviction")
        {
            type = await Dialog.wait({
                title : game.i18n.localize(`ROLL.CONVICTION`), 
                buttons : {
                    corruption : {
                        label : game.i18n.localize(`ROLL.CORRUPTION`)
                    },
                    mutation : {
                        label : game.i18n.localize(`ROLL.MUTATION`)
                    }
            }})
        }

        switch (type) {
            case "stealth":
                options.title = game.i18n.localize(`ROLL.STEALTH`);
                options.noDn = true;
                options.noWrath = true;
                return this._setupTest(CommonDialog, StealthRoll, {skill: "stealth"}, options)
            case "determination":
                options.title = game.i18n.localize(`ROLL.DETERMINATION`)
                options.noDn = true;
                options.noWrath = true;
                return this._setupTest(RollDialog, DeterminationRoll, {pool : this.combat.determination.total,}, options)
            case "corruption":
                options.title = game.i18n.localize(`ROLL.CORRUPTION`)
                options.conviction = true;
                return this._setupTest(RollDialog, CorruptionTest, {pool : this.combat.conviction.total}, options)
            case "mutation":
                options.title = game.i18n.localize(`ROLL.MUTATION`)
                options.conviction = true;
                return this._setupTest(RollDialog, MutationTest, {pool : this.combat.conviction.total}, options)
            case "fear":
                options.title = game.i18n.localize(`ROLL.FEAR`)
                options.resolve = true;
                options.noWrath = true;
                return this._setupTest(RollDialog, ResolveTest, {pool : this.combat.resolve.total}, options)
            case "terror":
                options.title = game.i18n.localize(`ROLL.TERROR`)
                options.resolve = true;
                options.noWrath = true;
                return this._setupTest(RollDialog, ResolveTest, {pool : this.combat.resolve.total}, options)
            case "influence":
                options.fields.pool = this.resources.influence
                options.title = game.i18n.localize(`ROLL.INFLUENCE`)
                options.noWrath = true;
                return this._setupTest(RollDialog, ResolveTest, {pool : this.combat.resolve.total}, options)
            default:
                throw new Error("Unknown roll type: " + type)
        }
    }

    async setupWeaponTest(weapon, options={})
    {
        if (game.user.targets.size > 1)
        {
            return Promise.all(game.user.targets.map(i => {
                let optionsCopy = foundry.utils.deepClone(options);
                optionsCopy.targets = [i];
                optionsCopy.multi = game.user.targets.size;
                return this._setupTest(WeaponDialog, WeaponTest, weapon, optionsCopy);
            }))
        }
        else 
        {
            return this._setupTest(WeaponDialog, WeaponTest, weapon, options);
        }
    }

    async setupPowerTest(power, options = {}) {
        return this._setupTest(PowerDialog, PowerTest, power, options)
    }

    async setupAbilityRoll(ability, options = {}) {
        let testData = {
            title: ability.name,
            speaker: this.speakerData(),
            itemId: ability.uuid,
            damage: {},
            ed: {},
            ap: {}
        }
        if (ability.hasDamage) {
            testData.damage = ability.damage.base
            testData.ed.value = ability.ed.base
            testData.ap.value = ability.ap.base
            testData.damageDice = {
                values : {
                  1 : 0,
                  2 : 0,
                  3 : 0,
                  4 : 1,
                  5 : 1,
                  6 : 2,
                },
                addValue : 0
              }
            testData.otherDamage = {
                mortal: ability.otherDamage.mortal,
                wounds: ability.otherDamage.wounds,
                shock: ability.otherDamage.shock,
            }

        }
        ui.sidebar.activateTab("chat")
        let roll = new AbilityRoll(testData)
        await roll.rollTest();
        roll.sendToChat();
    }

    async rollDetermination(wounds, message)
    {
        if (this.statuses.has("exhausted"))
        {
            return;
        }
        let test = await this.setupGenericTest("determination", {message, fields: {wounds}, resolveClose: true})
        if (test)
        {
            await test.rollTest();
        }
        return test;
    }

    characterCreation(archetype) {
        new Dialog({
            title: "Character Creation",
            content: "<p>Begin Character Creation?</p>",
            yes: () =>  new CharacterCreation({ actor: this, archetype }).render(true),
            no: async () => {
                let species = await warhammer.utility.findItemId(archetype.species.id, "species")
                let faction = await warhammer.utility.findItemId(archetype.faction.id, "faction")
                this.createEmbeddedDocuments("Item", [archetype.toObject(), faction?.toObject(), species?.toObject()].filter(i => i))
               }
        }).render(true)
    }

    async applyArchetype(archetype, apply) {

        if (this.type == "agent" && apply) // If agent, start character creation
        {
            new CharacterCreation({ actor: this, archetype }).render(true)
        }
        else if (this.type == "threat" && apply) // If threat, apply archetype statistics
        {
            message.push(`Applying ${archetype.name} Archetype`)
            let actorData = this.toObject();

            let items = await archetype.GetArchetypeItems()
            items.push(archetype.toObject())
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
            this.createEmbeddedDocuments("Item", items)
        }
    }

    async applyDamage(damage=0, {ap=0, shock=0, mortal=0}, {test, damageRoll, token}) {

        let resilience = foundry.utils.deepClone(this.system.combat.resilience)
        let res = resilience.total || 1
        ap = Math.abs(ap);

        // label, value, description
        let modifiers = {
            damage : [],
            ap : [],
            shock: [],
            mortal: [],
            resilience : []
        };

        let addModifierBreakdown = (type, label) => {
            for(let mod of modifiers[type])
            {
                report.breakdown.push(`<strong>${mod.label}</strong>: ${HandlebarsHelpers.numberFormat(mod.value, { hash: { sign: true } })} ${label}` + (mod.description ? ` (${mod.description})` : ""))
            }
        }
        
        let args = {damage, ap, shock, mortal, test, damageRoll, modifiers, resilience, actor: this}
        this.runScripts("preTakeDamage", args)
        test?.actor?.runScripts("preApplyDamage", args)
        test?.item?.runScripts("preApplyDamage", args)
        damage = args.damage;
        ap = args.ap;
        shock = args.shock;
        mortal = args.mortal;

        
        let invuln = resilience.invulnerable
        let forceField = resilience.forceField

        let wounds = 0

        let report = {
            message : null,
            breakdown : [],
            uuid : token?.uuid
        }

        damage += modifiers.damage.reduce((acc, mod) => acc + mod.value, 0);
        ap += modifiers.ap.reduce((acc, mod) => acc + mod.value, 0);
        shock += modifiers.shock.reduce((acc, mod) => acc + mod.value, 0);
        mortal += modifiers.mortal.reduce((acc, mod) => acc + mod.value, 0);

        if (invuln)
        {
            ap = 0;
        }
    
        if (ap)
        {
            let resilienceReduction = ap
            if (game.settings.get('wrath-and-glory', 'advancedArmour'))
            {
                resilienceReduction = Math.min(ap, target.system.combat.resilience.armour)
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
            if (forceField)
            {
                report.breakdown.push(`<strong>Mortal Wounds</strong>: ${mortal} converted to Wounds (${wounds + mortal})`);
                wounds += mortal;
                mortal = 0;
            }
        }

        addModifierBreakdown("shock", "Shock");


        if (wounds)
        {
            let determination = await this.rollDetermination(wounds, damageRoll?.message?.id)
            if (determination)
            {
                wounds = determination.result.wounds;                
                shock += determination.result.shock;     
                report.breakdown.push(`<strong>Determination</strong>: Converted ${shock} Wounds to Shock`)
                report.determination = determination;          
            }        
        }

        if (shock && (this.hasCondition("exhausted")))
        {
            mortal += shock;
            shock = 0;
            report.breakdown.push(`<strong>Exhausted</strong>: ${shock} Shock converted to Mortal Wounds (${mortal})`);
        }
    

        let updateObj = {}
        args = {wounds, shock, mortal, report, updateObj, actor: this}
        this.runScripts("takeDamage", args)
        test?.actor?.runScripts("applyDamage", args)
        test?.item?.runScripts("applyDamage", args)
        
        if (shock)
        {
            let newShock = this.system.combat.shock.value + shock
            updateObj["system.combat.shock.value"] = newShock;
            if (newShock >= this.system.combat.shock.max)
            {
                await this.addCondition("exhausted")
            }
        }
        if (wounds || mortal)
        {
            let newWounds = this.system.combat.wounds.value + wounds + mortal;
            updateObj["system.combat.wounds.value"] = newWounds;
            if (newWounds >= this.system.combat.wounds.max)
            {
                await this.addCondition("dying")
            }
        }
        if (shock || wounds || mortal)
        {
            report.breakdown.push(game.i18n.format("NOTE.APPLY_DAMAGE", {wounds : wounds + mortal, shock, name : token?.name}));
            report.message = game.i18n.format(`<strong>${token?.name}</strong> received damage`);
        }
        else 
        {
            report.message = game.i18n.format(`<strong>${token?.name}</strong> received no damage`);
        }

        report.breakdown = `<ul><li><p>${report.breakdown.join(`</p></li><li><p>`)}</p></li></ul>`
    
        report.wounds = wounds;
        report.mortal = mortal;
        report.shock = shock;
        this.update(updateObj);
        return report;
    }
    

    //#endregion

    get Size() {
        switch (this.combat.size) {
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

    async addCondition(effect, flags = {}) {
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
            return this.createEmbeddedDocuments("ActiveEffect", [effect], {condition: true})
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


    hasKeyword(keyword) {
        return !!this.itemTypes.keyword.find(i => i.name == keyword)
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

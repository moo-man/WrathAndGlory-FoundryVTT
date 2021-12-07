import { RollDialog, WeaponDialog, PowerDialog } from "../common/dialog.js";
import { WNGTest } from "../common/tests/test.js";
import WeaponTest from "../common/tests/weapon-test.js";
import PowerTest from "../common/tests/power-test.js";
import CorruptionTest from "../common/tests/corruption-test.js";
import MutationTest from "../common/tests/mutation-test.js";
import ResolveTest from "../common/tests/resolve-test.js";
import DeterminationRoll from "../common/tests/determination.js";
import AbilityRoll from "../common/tests/ability-roll.js";
import WNGUtility from "../common/utility.js";

export class WrathAndGloryActor extends Actor {

    async _preCreate(data, options, user) {
        if (data._id)
            options.keepId = WNGUtility._keepID(data._id, this)
        
        await super._preCreate(data, options, user)

        let initData = {
            "token.bar1": { "attribute": "combat.wounds" },
            "token.bar2": { "attribute": "combat.shock" },
            "token.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "token.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "token.disposition": CONST.TOKEN_DISPOSITIONS.NEUTRAL,
            "token.name": data.name,
            "flags.wrath-and-glory.autoCalc.defense": true,
            "flags.wrath-and-glory.autoCalc.resilience": true,
            "flags.wrath-and-glory.autoCalc.shock": true,
            "flags.wrath-and-glory.autoCalc.awareness": true,
            "flags.wrath-and-glory.autoCalc.resolve": true,
            "flags.wrath-and-glory.autoCalc.determination": true,
            "flags.wrath-and-glory.autoCalc.wounds": true,
            "flags.wrath-and-glory.autoCalc.conviction": true,
            "flags.wrath-and-glory.autoWounded" : true
        }
        if (data.type === "agent") {
            initData["token.vision"] = true;
            initData["token.actorLink"] = true;
        }
        this.data.update(initData)
    }


    prepareBaseData() {
    }

    prepareDerivedData() {
        this._applyDerivedEffects()
        this._computeAttributes();
        this._computeSkills();
        this._computeItems();
        this._computeCombat();
    }

    prepareData() {
        this.itemCategories = this.itemTypes
        this.derivedEffects = []
        super.prepareData();
        if (this.type === "agent") 
            this.prepareAgent();
        else if (this.type === "threat")
            this.prepareThreat();
    }


    prepareAgent() {
        this._computeExperience();
    }

    prepareThreat() {

    }

    _computeItems() {
        this.combat.resilience.armor = 0;
        for (let item of this.items) {
            item.prepareOwnedData()
            if (item.isArmour) {
                this._computeArmour(item);
            }
            if (this.advances && item.cost) {
                this.experience.spent = this.experience.spent + item.cost;
            }
        }
    }

    _computeArmour(item) {
        if (this.combat.resilience.armor < item.rating) {
            this.combat.resilience.armor = item.rating;
        }
    }

    _computeAttributes() {
        for (let attribute of Object.values(this.attributes)) {
            attribute.total = attribute.rating + attribute.bonus;
            attribute.cost = game.wng.utility.getAttributeCostTotal(attribute.rating);
            if (this.advances) {
                this.experience.spent = this.experience.spent + attribute.cost;
            }
        }
    }

    _computeSkills() {
        for (let skill of Object.values(this.skills)) {
            skill.cost = game.wng.utility.getSkillCostTotal(skill.rating);
            skill.total = this.attributes[skill.attribute].total + skill.rating + skill.bonus;
            if (this.advances) {
                this.experience.spent = this.experience.spent + skill.cost;
            }
        }
    }

    _computeCombat() {
        let autoCalc = this.getFlag("wrath-and-glory", "autoCalc") || {}

        if (autoCalc.awareness)
            this.combat.passiveAwareness.total = this._setDefault(Math.ceil(this.skills.awareness.total / 2) + this.combat.passiveAwareness.bonus, 1);
        if (autoCalc.defense)
            this.combat.defense.total = this._setDefault(this.attributes.initiative.total - 1 + this.combat.defense.bonus, 1);
        if (autoCalc.resolve)
            this.combat.resolve.total = this._setDefault(this.attributes.willpower.total - 1, 1) + this.combat.resolve.bonus;
        if (autoCalc.conviction)
            this.combat.conviction.total = this._setDefault(this.attributes.willpower.total + this.combat.conviction.bonus, 1);
        if (autoCalc.resilience)
            this.combat.resilience.total = this._setDefault(this.attributes.toughness.total + 1 + this.combat.resilience.bonus + this.combat.resilience.armor, 1);
        if (autoCalc.wounds && this.type == "agent")
            this.combat.wounds.max = this._setDefault((this.advances.tier * 2) + this.attributes.toughness.total + this.combat.wounds.bonus, 1);
        if (autoCalc.determination)
            this.combat.determination.total = this._setDefault(this.attributes[this.combat.determination.attribute || "toughness"].rating + this.combat.determination.bonus, 1);
        if (autoCalc.shock && this.type == "agent")
            this.combat.shock.max = this._setDefault(this.attributes.willpower.rating + this.advances.tier + this.combat.shock.bonus, 1);
    }

    _setDefault(value, fallback) {
        return (value < fallback ? fallback : value);
    }

    _computeExperience() {
        this.experience.spent += this.advances.species;
        this.experience.current = this.experience.total - this.experience.spent;
    }

    _applyDerivedEffects() {
        this.derivedEffects.forEach(change => {
            change.effect.fillDerivedData(this, change)
            const modes = CONST.ACTIVE_EFFECT_MODES;
            switch ( change.mode ) {
                case modes.CUSTOM:
                return change.effect._applyCustom(this, change);
                case modes.ADD:
                return change.effect._applyAdd(this, change);
                case modes.MULTIPLY:
                return change.effect._applyMultiply(this, change);
                case modes.OVERRIDE:
                return change.effect._applyOverride(this, change);
                case modes.UPGRADE:
                case modes.DOWNGRADE:
                return change.effect._applyUpgrade(this, change);
            }
        })
    }

    //#region Rolling
    async setupAttributeTest(attribute, options={}) {
        let attributeObject = this.attributes[attribute]

        let dialogData = this._baseDialogData();
        dialogData.title = `${game.i18n.localize(attributeObject.label)} Test`
        dialogData.pool.size = attributeObject.total
        this._addOptions(dialogData, options)
        let testData = await RollDialog.create(dialogData)
        testData.title = dialogData.title
        testData.speaker = this.speakerData();
        testData.type = "attribute"
        testData.attribute = attribute;
        return new WNGTest(testData)
    }

    async setupSkillTest(skill, options={}) {
        let skillObject = this.skills[skill]

        let dialogData = this._baseDialogData();
        dialogData.title = `${game.i18n.localize(skillObject.label)} Test`
        dialogData.pool.size = skillObject.total
        this._addOptions(dialogData, options)
        let testData = await RollDialog.create(dialogData)
        testData.title = dialogData.title
        testData.speaker = this.speakerData();
        testData.skill = skill
        testData.type = "skill"
        testData.attribute = skillObject.attribute
        return new WNGTest(testData)
    }

    async setupGenericTest(type, options={}) {
        let dialogData = this._baseDialogData();
        let testClass = WNGTest
        switch(type)
        {
            case "determination": 
            dialogData.pool.size = this.combat.determination.total
            dialogData.title =  game.i18n.localize(`ROLL.DETERMINATION`)
            dialogData.determination = true;
            testClass = DeterminationRoll;
            break;
            case "conviction": 
            dialogData.pool.size = this.combat.conviction.total
            dialogData.title =  game.i18n.localize(`ROLL.CONVICTION`)
            break;
            case "corruption": 
            dialogData.pool.size = this.combat.conviction.total
            dialogData.title =  game.i18n.localize(`ROLL.CORRUPTION`)
            this._addCorruptionData(dialogData)
            testClass = CorruptionTest;
            break;
            case "mutation": 
            dialogData.pool.size = this.combat.conviction.total
            dialogData.title =  game.i18n.localize(`ROLL.MUTATION`)
            dialogData.difficulty.target = 3
            testClass = MutationTest;
            break;
            case "fear": 
            dialogData.pool.size = this.combat.resolve.total
            dialogData.title =  game.i18n.localize(`ROLL.FEAR`)
            dialogData.type == "fear"
            testClass = ResolveTest
            break;
            case "terror": 
            dialogData.pool.size = this.combat.resolve.total
            dialogData.title =  game.i18n.localize(`ROLL.TERROR`)
            dialogData.type == "terror"
            testClass = ResolveTest
            break;
            case "influence": 
            dialogData.pool.size = this.resources.influence
            dialogData.title = game.i18n.localize(`ROLL.INFLUENCE`)
            break;
            
        }

        this._addOptions(dialogData, options)
        let testData = await RollDialog.create(dialogData)
        testData.title = dialogData.title
        testData.speaker = this.speakerData();
        testData.type = type
        ui.sidebar.activateTab("chat")
        return new testClass(testData)
    }

    async setupWeaponTest(weapon, options={}) {
        if (typeof weapon == "string")
            weapon = this.items.get(weapon)

        let dialogData = this._weaponDialogData(weapon);
        dialogData.title = `${weapon.name} Test`
        this._addOptions(dialogData, options)
        let testData = await WeaponDialog.create(dialogData)
        testData.title = dialogData.title
        testData.speaker = this.speakerData();
        testData.type = "weapon"
        testData.itemId = weapon.id
        testData.skill = weapon.isMelee ? "weaponSkill" : "ballisticSkill"
        testData.attribute = weapon.skill.attribute
        ui.sidebar.activateTab("chat")
        return new WeaponTest(testData)
    }

    async setupPowerTest(power, options={}) {
        if (typeof power == "string")
            power = this.items.get(power)

        let dialogData = this._powerDialogData(power);
        dialogData.title = `${power.name}`
        this._addOptions(dialogData, options)
        let testData = await PowerDialog.create(dialogData)
        testData.title = dialogData.title
        testData.speaker = this.speakerData();
        testData.type = "power"
        testData.itemId = power.id
        testData.skill = "psychicMastery"
        testData.attribute = power.skill.attribute
        ui.sidebar.activateTab("chat")
        return new PowerTest(testData)
    }

    async setupAbilityRoll(ability, options={})
    {
        let testData = {
            title : ability.name,
            speaker : this.speakerData(),
            itemId : ability.id,
            damage : {},
            ed : {},
            ap : {}
        }
        if (ability.hasDamage)
        {
            testData.damage.base = ability.damage.base
            testData.damage.bonus = ability.damage.bonus
            testData.damage.rank = ability.damage.rank
            testData.ed.base = ability.ed.base
            testData.ed.bonus = ability.ed.bonus
            testData.ed.rank = ability.ed.rank
            testData.ap.base = ability.ap.base
            testData.ap.bonus = ability.ap.bonus
            testData.ap.rank = ability.ap.rank
        }
        ui.sidebar.activateTab("chat")
        return new AbilityRoll(testData)
    }

    _baseDialogData() {
        return {
            difficulty: {
                target: 3,
                penalty: 0,
                rank: "none"
            },
            pool: {
                size: 1,
                bonus: 0,
                rank: "none"
            },
            wrath: {
                base: 1
            },
            effects : this.effects.filter(i => i.hasRollEffect).filter(i => !i.data.disabled)
        };
    }

    _weaponDialogData(weapon) {
        let dialogData = this._baseDialogData()
        dialogData.weapon = weapon
        dialogData.pool.size = weapon.skill.total;
        dialogData.pool.bonus = weapon.attack.base + weapon.attack.bonus;
        if (this.isMob)
            dialogData.pool.bonus += Math.ceil(this.mob / 2)
        dialogData.pool.rank = weapon.attack.rank;
        dialogData.damageValues = weapon.damageValues
        dialogData.difficulty.penalty += weapon.traitList.unwieldy ? weapon.traitList.unwieldy.rating : 0
        return dialogData
    }

    _powerDialogData(power) {
        let dialogData = this._baseDialogData()
        dialogData.power = power
        dialogData.difficulty.target = power.dn
        dialogData.pool.size = power.skill.total;
        return dialogData
    }

    _addOptions(dialogData, options)
    {
        dialogData.difficulty.target = options.dn || dialogData.difficulty.target
        dialogData.pool.size = options.pool || dialogData.pool.size
        dialogData.title = options.title || dialogData.title
    }

    _addCorruptionData(dialogData)
    {
        let level = game.wng.config.corruptionLevels[this.corruptionLevel]
        dialogData.difficulty.penalty += level.dn
    }

    speakerData() {
        if (this.isToken) {
            return {
                token: this.token.id,
                scene: this.token.parent.id
            }
        }
        else {
            return {
                actor: this.id
            }
        }
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

    get isMob()
    {
        return this.type == "threat" && this.mob > 1
    }
    
    async addCondition(effect) {
        if (typeof (effect) === "string")
          effect = duplicate(CONFIG.statusEffects.concat(Object.values(game.wng.config.systemEffects)).find(e => e.id == effect))
        if (!effect)
          return "No Effect Found"
    
        if (!effect.id)
          return "Conditions require an id field"
    
    
        let existing = this.hasCondition(effect.id)
    
        if (!existing) {
          effect.label = game.i18n.localize(effect.label)
          effect["flags.core.statusId"] = effect.id;
          delete effect.id
          return this.createEmbeddedDocuments("ActiveEffect", [effect])
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
    
    
      hasCondition(conditionKey) {
        let existing = this.effects.find(i => i.getFlag("core", "statusId") == conditionKey)
        return existing
      }

    get attributes() { return this.data.data.attributes }
    get skills() { return this.data.data.skills }
    get combat() { return this.data.data.combat }
    get bio() { return this.data.data.bio }
    get advances() { return this.data.data.advances }
    get experience() { return this.data.data.experience }
    get resources() { return this.data.data.resources }
    get corruption() { return this.data.data.corruption }
    get notes() { return this.data.data.notes }
    get mob() {return this.data.data.mob}

    getItemTypes(type) {
        return (this.itemCategories || this.itemTypes)[type]
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

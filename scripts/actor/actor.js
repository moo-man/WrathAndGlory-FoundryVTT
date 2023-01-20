import { WNGTest } from "../common/tests/test.js";
import WeaponTest from "../common/tests/weapon-test.js";
import PowerTest from "../common/tests/power-test.js";
import CorruptionTest from "../common/tests/corruption-test.js";
import MutationTest from "../common/tests/mutation-test.js";
import ResolveTest from "../common/tests/resolve-test.js";
import DeterminationRoll from "../common/tests/determination.js";
import AbilityRoll from "../common/tests/ability-roll.js";
import WNGUtility from "../common/utility.js";
import StealthRoll from "../common/tests/stealth.js";
import CharacterCreation from "../apps/character-creation.js";
import { RollDialog } from "../common/dialogs/base-dialog.js";
import { WeaponDialog } from "../common/dialogs/weapon-dialog.js";
import { PowerDialog } from "../common/dialogs/power-dialog.js";

export class WrathAndGloryActor extends Actor {

    async _preCreate(data, options, user) {
        if (data._id)
            options.keepId = WNGUtility._keepID(data._id, this)

        await super._preCreate(data, options, user)

        let initData = {
            "prototypeToken.bar1": { "attribute": "combat.wounds" },
            "prototypeToken.bar2": { "attribute": "combat.shock" },
            "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "prototypeToken.disposition": CONST.TOKEN_DISPOSITIONS.NEUTRAL,
            "prototypeToken.name": data.name,
            "flags.wrath-and-glory.autoCalc.defence": true,
            "flags.wrath-and-glory.autoCalc.resilience": true,
            "flags.wrath-and-glory.autoCalc.shock": true,
            "flags.wrath-and-glory.autoCalc.awareness": true,
            "flags.wrath-and-glory.autoCalc.resolve": true,
            "flags.wrath-and-glory.autoCalc.determination": true,
            "flags.wrath-and-glory.autoCalc.wounds": true,
            "flags.wrath-and-glory.autoCalc.conviction": true,
            "flags.wrath-and-glory.autoWounded": true,
            "flags.wrath-and-glory.autoExhausted": true,
            "flags.wrath-and-glory.generateMetaCurrencies": true
        }
        if (data.type === "agent") {
            initData["prototypeToken.vision"] = true;
            initData["prototypeToken.actorLink"] = true;
        }
        this.updateSource(initData)
    }


    prepareBaseData() {
    }

    prepareDerivedData() {
        this._applyDerivedEffects()
        this._computeAttributes();
        this._computeItems();
        this._computeSkills();
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
        let armour = []
        for (let item of this.items) {
            item.prepareOwnedData()
            if (item.isArmour && item.equipped) {
                armour.push(item)
            }
            if (this.advances && item.cost && item.type != "species") { // Species is included in archetype
                this.experience.spent = this.experience.spent + item.cost;
            }
        }
        this._computeArmour(armour);
    }

    _computeArmour(armour) {
        this.combat.resilience.armour = 0;
        let highestRes = 0
        for (let item of armour) {
            if (item.rating)

                if (item.traitList.powered)
                    this.attributes.strength.total += item.traitList.powered.rating

            if (item.traitList.bulk)
                this.combat.speed -= item.traitList.bulk.rating

            if (item.traitList.shield)
            {
                this.combat.resilience.armour += item.rating;
                this.combat.defence.bonus += item.rating
            }
            else if (item.rating > highestRes)
                highestRes = item.rating


            if (item.traitList.invulnerable)
                this.combat.resilience.invulnerable = true
        }
        this.combat.resilience.armour += highestRes

    }

    _computeAttributes() {
        for (let attribute of Object.values(this.attributes)) {
            attribute.total = attribute.rating + attribute.bonus + attribute.base;
            attribute.cost = game.wng.utility.getAttributeCostTotal(attribute.rating + attribute.base, attribute.base);
            if (this.advances) {
                this.experience.spent = this.experience.spent + attribute.cost;
            }
        }
    }

    _computeSkills() {
        for (let skill of Object.values(this.skills)) {
            skill.cost = game.wng.utility.getSkillCostTotal(skill.rating + skill.base, skill.base);
            skill.total = this.attributes[skill.attribute].total + skill.rating + skill.bonus + skill.base;
            if (this.advances) {
                this.experience.spent = this.experience.spent + skill.cost;
            }
        }
    }

    _computeCombat() {
        let autoCalc = this.getFlag("wrath-and-glory", "autoCalc") || {}

        if (autoCalc.awareness)
            this.combat.passiveAwareness.total = this._setDefault(Math.ceil(this.skills.awareness.total / 2) + this.combat.passiveAwareness.bonus, 1);
        if (autoCalc.defence)
            this.combat.defence.total = this._setDefault(this.attributes.initiative.total - 1 + this.combat.defence.bonus, 1);
        if (autoCalc.resolve)
            this.combat.resolve.total = this._setDefault(this.attributes.willpower.total - 1, 1) + this.combat.resolve.bonus;
        if (autoCalc.conviction)
            this.combat.conviction.total = this._setDefault(this.attributes.willpower.total + this.combat.conviction.bonus, 1);
        if (autoCalc.resilience)
            this.combat.resilience.total = this._setDefault(this.attributes.toughness.total + 1 + this.combat.resilience.bonus + this.combat.resilience.armour, 1);
        if (autoCalc.wounds && this.type == "agent")
            this.combat.wounds.max = this._setDefault((this.advances.tier * 2) + this.attributes.toughness.total + this.combat.wounds.bonus, 1);
        if (autoCalc.determination)
            this.combat.determination.total = this._setDefault(this.attributes[this.combat.determination.attribute || "toughness"].total + this.combat.determination.bonus, 1);
        if (autoCalc.shock && this.type == "agent")
            this.combat.shock.max = this._setDefault(this.attributes.willpower.total + this.advances.tier + this.combat.shock.bonus, 1);

        if (autoCalc.defence)
        {
            this._applySizeModifiers();
        }
    }

    _setDefault(value, fallback) {
        return (value < fallback ? fallback : value);
    }

    _computeExperience() {
        this.experience.current = this.experience.total - this.experience.spent;
    }

    _applyDerivedEffects() {
        this.derivedEffects.forEach(change => {
            change.effect.fillDerivedData(this, change)
            change.effect.apply(this, change);
        })
    }

    _applySizeModifiers()
    {
        if (this.combat.size == "small")
        {
            this.combat.defence.total += 1
        }
        else if (this.combat.size == "tiny")
        {
            this.combat.defence.total += 2  
        }
    }

    //#region Rolling
    async setupAttributeTest(attribute, options = {}) {
        let attributeObject = this.attributes[attribute]

        let dialogData = this._baseDialogData();
        dialogData.title = `${game.i18n.localize(attributeObject.label)} Test`
        dialogData.pool.size = attributeObject.total
        this._addOptions(dialogData, options)
        dialogData.type = "attribute"
        dialogData.attribute = attribute
        let testData = await RollDialog.create(dialogData)
        testData.targets = dialogData.targets
        testData.title = dialogData.title
        testData.speaker = this.speakerData();
        testData.attribute = attribute;
        return new WNGTest(testData)
    }

    async setupSkillTest(skill, options = {}) {
        let skillObject = this.skills[skill]

        let dialogData = this._baseDialogData();
        dialogData.title = `${game.i18n.localize(skillObject.label)} Test`
        dialogData.pool.size = skillObject.total
        this._addOptions(dialogData, options)
        dialogData.type = "skill"
        dialogData.skill = skill
        let testData = await RollDialog.create(dialogData)
        testData.targets = dialogData.targets
        testData.title = dialogData.title
        testData.speaker = this.speakerData();
        testData.skill = skill
        testData.attribute = skillObject.attribute
        return new WNGTest(testData)
    }

    async setupGenericTest(type, options = {}) {
        let dialogData = this._baseDialogData();
        let testClass = WNGTest
        switch (type) {
            case "stealth":
                dialogData.pool.size = this.skills.stealth.total;
                dialogData.title = game.i18n.localize(`ROLL.STEALTH`);
                dialogData.noDn = true;
                testClass = StealthRoll;
                break;
            case "determination":
                dialogData.pool.size = this.combat.determination.total
                dialogData.title = game.i18n.localize(`ROLL.DETERMINATION`)
                dialogData.determination = true;
                dialogData.noDn = true;
                testClass = DeterminationRoll;
                break;
            case "conviction":
                dialogData.pool.size = this.combat.conviction.total
                dialogData.title = game.i18n.localize(`ROLL.CONVICTION`)
                break;
            case "corruption":
                dialogData.pool.size = this.combat.conviction.total
                dialogData.title = game.i18n.localize(`ROLL.CORRUPTION`)
                this._addCorruptionData(dialogData)
                testClass = CorruptionTest;
                break;
            case "mutation":
                dialogData.pool.size = this.combat.conviction.total
                dialogData.title = game.i18n.localize(`ROLL.MUTATION`)
                dialogData.difficulty.target = 3
                testClass = MutationTest;
                break;
            case "fear":
                dialogData.pool.size = this.combat.resolve.total
                dialogData.title = game.i18n.localize(`ROLL.FEAR`)
                dialogData.type == "fear"
                testClass = ResolveTest
                break;
            case "terror":
                dialogData.pool.size = this.combat.resolve.total
                dialogData.title = game.i18n.localize(`ROLL.TERROR`)
                dialogData.type == "terror"
                testClass = ResolveTest
                break;
            case "influence":
                dialogData.pool.size = this.resources.influence
                dialogData.title = game.i18n.localize(`ROLL.INFLUENCE`)
                break;
            default:
                throw new Error("Unknown roll type: " + type)
        }
        this._addOptions(dialogData, options)
        dialogData.type = type
        let testData = await RollDialog.create(dialogData)
        testData.title = dialogData.title
        testData.speaker = this.speakerData();
        testData.type = type
        ui.sidebar.activateTab("chat")
        return new testClass(testData)
    }



    async setupWeaponTest(weapon, options={})
    {
        if (typeof weapon == "string")
            weapon = this.items.get(weapon)

        let tests = []
        // If targets, call this function again with single target option
        if (game.user.targets.size)
        {
            let targets = Array.from(game.user.targets)
            game.user.updateTokenTargets([])
            // Function needs to return an array of WeaponTests so need to do some funky stuff to convert
            targets.forEach(target => tests.push(this.setupWeaponTest(weapon, {target, multi : targets.length})))

            tests = await Promise.all(tests)
            tests = tests.map(t => t[0])
        }

        else // If no target or target supplied in options
        {
            let dialogData = this._weaponDialogData(weapon, {multi : options.multi, targets : [options.target].filter(t => t)});
            dialogData.title = `${weapon.name} Test`
            this._addOptions(dialogData, options)
            dialogData.type = "weapon"
            dialogData.skill = weapon.isMelee ? "weaponSkill" : "ballisticSkill"
            dialogData.attribute = weapon.skill.attribute
            let testData = await WeaponDialog.create(dialogData)
            testData.targets = dialogData.targets
            testData.title = dialogData.title
            testData.speaker = this.speakerData();
            testData.itemId = weapon.id
            testData.skill = dialogData.skill
            testData.attribute = dialogData.attribute
            ui.sidebar.activateTab("chat")
            tests =  [new WeaponTest(testData)]
        }
        return tests
    }

    async setupPowerTest(power, options = {}) {
        if (typeof power == "string")
            power = this.items.get(power)

        let dialogData = this._powerDialogData(power);
        dialogData.title = `${power.name}`
        this._addOptions(dialogData, options)
        dialogData.type = "power"
        dialogData.skill = "psychicMastery"
        dialogData.attribute = power.skill.attribute
        let testData = await PowerDialog.create(dialogData)
        testData.targets = dialogData.targets
        testData.title = dialogData.title
        testData.speaker = this.speakerData();
        testData.itemId = power.id
        testData.skill = dialogData.skill
        testData.attribute = dialogData.attribute
        ui.sidebar.activateTab("chat")
        return new PowerTest(testData)
    }

    async setupAbilityRoll(ability, options = {}) {
        let testData = {
            title: ability.name,
            speaker: this.speakerData(),
            itemId: ability.id,
            damage: {},
            ed: {},
            ap: {}
        }
        if (ability.hasDamage) {
            testData.damage.base = ability.damage.base
            testData.damage.bonus = ability.damage.bonus
            testData.damage.rank = ability.damage.rank
            testData.ed.base = ability.ed.base
            testData.ed.bonus = ability.ed.bonus
            testData.ed.rank = ability.ed.rank
            testData.ap.base = ability.ap.base
            testData.ap.bonus = ability.ap.bonus
            testData.ap.rank = ability.ap.rank
            testData.otherDamage = {
                mortalWounds: { value: ability.otherDamage.mortalWounds, bonus : 0 },
                wounds: { value: ability.otherDamage.wounds, bonus : 0 },
                shock: { value: ability.otherDamage.shock, bonus : 0 },
            }

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
                base: this.hasCondition("dying") ? 1 + this.itemCategories["traumaticInjury"].length : 1
            },
            changeList: this.getDialogChanges({ condense: true }),
            changes: this.getDialogChanges(),
            actor: this,
            targets: Array.from(game.user.targets)
        };
    }


    _weaponDialogData(weapon, options={}) {

        let dialogData = this._baseDialogData()
        if (options.targets)
            dialogData.targets = options.targets;

        if (weapon.Ammo) {
            // Add ammo dialog changes if any exist
            dialogData.changeList = this.getDialogChanges({ condense: true, add: weapon.Ammo.ammoDialogEffects, targets : dialogData.targets })
            dialogData.changes = this.getDialogChanges({ add: weapon.Ammo.ammoDialogEffects, targets : dialogData.targets })
        }
        dialogData.weapon = weapon
        dialogData.pool.size = weapon.skill.total;
        dialogData.pool.bonus = weapon.attack.base + weapon.attack.bonus;
        if (this.isMob)
            dialogData.pool.bonus += Math.ceil(this.mob / 2)
        dialogData.pool.rank = weapon.attack.rank;
        dialogData.damageValues = weapon.damageValues

        dialogData.damage = duplicate(weapon.damage)
        dialogData.ed = duplicate(weapon.ed)
        dialogData.ap = duplicate(weapon.ap)

        if (weapon.isMelee) {
            dialogData.damage.base += this.attributes.strength.total
        }

        if (weapon.traitList.force) {
            if (this.hasKeyword("PSYKER"))
                dialogData.damage.bonus += Math.ceil(this.attributes.willpower.total / 2)
            else
                dialogData.damage.bonus -= 2
        }

        if (dialogData.targets[0])
        {
            let target = dialogData.targets[0]
            let token
            dialogData.difficulty.target = target.actor.combat.defence.total

            if (this.isToken)
                token = this.token
            else
                token = this.getActiveTokens()[0]?.document

            if (token)
                dialogData.distance = canvas.grid.measureDistances([{ ray: new Ray({ x: token.x, y: token.y }, { x: target.x, y: target.y }) }], { gridSpaces: true })[0]

            if (target.actor.system.combat.size == "large")
            {
                dialogData.pool.bonus += 1;
            }
            else if (target.actor.system.combat.size == "huge")
            {
                dialogData.pool.bonus += 2;
            }
            else if (target.actor.system.combat.size == "gargantuan")
            {
                dialogData.pool.bonus += 3;
            }
        }
        dialogData.difficulty.penalty += weapon.traitList.unwieldy ? weapon.traitList.unwieldy.rating : 0

        if (this.hasKeyword("ORK") && weapon.traitList["waaagh!"])
        {
            dialogData.pool.bonus += 1;
            if (this.combat.wounds.value > 0)
                dialogData.ed.bonus += 1
        }

        if (options.multi > 1)
        {
            dialogData.difficulty.penalty += (options.multi - 1) * 2;
            dialogData.multi = options.multi
        }

        return dialogData
    }

    _powerDialogData(power) {
        let dialogData = this._baseDialogData()
        dialogData.power = power
        dialogData.difficulty.target = power.DN
        if (!Number.isNumeric(dialogData.difficulty.target)) {
            ui.notifications.warn(game.i18n.localize("DIALOG.TARGET_DEFENSE_WARNING"))
        }
        dialogData.pool.size = power.skill.total;
        return dialogData
    }

    _addOptions(dialogData, options) {
        dialogData.difficulty.target = options.dn || dialogData.difficulty.target
        dialogData.pool.size = options.pool || dialogData.pool.size
        dialogData.title = options.title || dialogData.title
        delete options.title;
        delete options.pool;
        delete options.dn;

        mergeObject(dialogData, options);
    }

    _addCorruptionData(dialogData) {
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

    getDialogChanges({ condense = false, add = [], targets=[] } = {}) {
        let effects = Array.from(this.effects).concat(add);
        // Aggregate dialog changes from each effect
        let changes = effects.filter(i => !i.disabled).reduce((prev, current) => prev.concat(current.getDialogChanges({ condense, indexOffset: prev.length })), [])

        if (targets.length) {
            let target = targets[0].actor
            let targetChanges = target.effects.reduce((prev, current) => prev.concat(current.getDialogChanges({ target, condense, indexOffset: changes.length })), [])
            changes = changes.concat(targetChanges)
        }

        return changes
    }


    characterCreation(archetype) {
        new Dialog({
            title: "Character Creation",
            content: "<p>Begin Character Creation?</p>",
            yes: () =>  new CharacterCreation({ actor: this, archetype }).render(true),
            no: async () => {
                let species = await game.wng.utility.findItem(archetype.species.id, "species")
                let faction = await game.wng.utility.findItem(archetype.faction.id, "faction")
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
            ui.notifications.notify(`Applying ${archetype.name} Archetype`)
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

            actorData.img = archetype.img
            actorData.token.img = archetype.img.replace("images", "tokens")
            actorData.token.img = archetype.img.replace("actors", "tokens")

            await this.update(actorData)

            // Add items separately so active effects get added seamlessly
            this.createEmbeddedDocuments("Item", items)
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

    get isMob() {
        return this.type == "threat" && this.mob > 1
    }

    get activeBackground() {
        let background = {
            origin: "",
            accomplishment: "",
            goal: ""
        }
        if (!this.faction)
            return background

        background.origin = this.faction.backgrounds.origin.find(b => b.active)?.description
        background.accomplishment = this.faction.backgrounds.accomplishment.find(b => b.active)?.description
        background.goal = this.faction.backgrounds.goal.find(b => b.active)?.description
        return background
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

    get archetype() { return this.getItemTypes("archetype")[0] }
    get species() { return this.getItemTypes("species")[0] }
    get faction() { return this.getItemTypes("faction")[0] }

    hasCondition(conditionKey) {
        let existing = this.effects.find(i => i.getFlag("core", "statusId") == conditionKey)
        return existing
    }

    hasKeyword(keyword) {
        return !!this.getItemTypes("keyword").find(i => i.name == keyword)
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
    get mob() { return this.system.mob }

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

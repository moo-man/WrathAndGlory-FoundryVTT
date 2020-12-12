export class WrathAndGloryActor extends Actor {
    prepareData() {
        super.prepareData();
        if (this.data.type === "agent") {
            this._initializeAgent(this.data);
        } else if (this.data.type === "threat") {
            this._initializeThreat(this.data);
        }
    }

    _initializeAgent(data) {
        this._initializeBonus(data);
        this._computeItems(data);
        this._computeAttributes(data);
        this._computeSkills(data);
        this._computeCombat(data);
        this._computeExperience(data);
    }

    _initializeThreat(data) {
        this._initializeBonus(data);
        this._computeItems(data);
        this._computeAttributes(data);
        this._computeSkills(data);
    }

    _initializeBonus(data) {
        if (data.data.hasOwnProperty("advances")) {
            data.data.advances.experience.spent = 0;
            data.data.advances.experience.total = 0;
        }
        for (let attribute of Object.values(data.data.attributes)) {
            attribute.bonus = 0;
        }
        for (let skill of Object.values(data.data.skills)) {
            skill.bonus = 0;
        }
    }

    _computeItems(data) {
        data.data.combat.resilence.armor = 0;
        for (let item of Object.values(data.items)) {
            item.isKeyword = item.type === "keyword";
            item.isTalent = item.type === "talent";
            item.isAbility = item.type === "ability";
            item.isTalentOrAbility = item.isTalent || item.isAbility;
            item.isPsychicPower = item.type === "psychicPower";
            item.isArmour = item.type === "armour";
            item.isWeapon = item.type === "weapon";
            item.isWeaponUpgrade = item.type === "weaponUpgrade";
            item.isGear = item.type === "gear";
            item.isTraumaticInjury = item.type === "traumaticInjury";
            item.isMemorableInjury = item.type === "memorableInjury";
            item.isAscension = item.type === "ascension";
            item.isMutation = item.type === "mutation";
            item.isAmmo = item.type === "ammo";
            item.isAugmentic = item.type === "augmentic";
            if (item.isArmour) {
                this._computeArmour(data, item);
            }
            if (item.data.hasOwnProperty("bonus")) {
                this._computeBonus(data, item.data.bonus);
            }
            if (data.data.hasOwnProperty("advances") && item.data.hasOwnProperty("cost")) {
                data.data.advances.experience.spent = data.data.advances.experience.spent + item.data.cost;
            }
        }
    }

    _computeArmour(data, item) {
        if (data.data.combat.resilence.armor < item.data.rating) {
            data.data.combat.resilence.armor = item.data.rating;
        }
    }

    _computeAttributes(data) {
        for (let attribute of Object.values(data.data.attributes)) {
            attribute.total = attribute.rating + attribute.bonus;
            if (data.data.hasOwnProperty("advances")) {
                data.data.advances.experience.spent = data.data.advances.experience.spent + attribute.cost;
            }
        }
    }

    _computeBonus(data, bonus) {
        for (let [key, value] of Object.entries(data.data.attributes)) {
            value.bonus = value.bonus + bonus.attributes[key];
        }
        for (let [key, value] of Object.entries(data.data.skills)) {
            value.bonus = value.bonus + bonus.skills[key];
        }
        for (let [key, value] of Object.entries(data.data.combat)) {
            if (value.hasOwnProperty("bonus")) {
                value.bonus = value.bonus + bonus.combat[key];
            }
        }
    }

    _computeSkills(data) {
        let middle = Object.values(data.data.skills).length / 2;
        let i = 0;
        for (let skill of Object.values(data.data.skills)) {
            skill.total = data.data.attributes[skill.attribute].total + skill.rating + skill.bonus;
            if (data.data.hasOwnProperty("advances")) {
                data.data.advances.experience.spent = data.data.advances.experience.spent + skill.cost;
            }
            skill.isLeft = i < middle;
            skill.isRight = i >= middle;
            i++;
        }
    }

    _computeCombat(data) {
        data.data.combat.passiveAwareness.total = this._setDefault(Math.ceil(data.data.skills.awareness.total / 2) + data.data.combat.passiveAwareness.bonus, 1);
        data.data.combat.defense.total = this._setDefault(data.data.attributes.initiative.total - 1 + data.data.combat.defense.bonus, 1);
        data.data.combat.resolve.total = this._setDefault(data.data.attributes.willpower.total - 1 + data.data.combat.resolve.bonus, 1);
        data.data.corruption.conviction = this._setDefault(data.data.attributes.willpower.total, 1);
        data.data.combat.resilence.total = this._setDefault(data.data.attributes.toughness.rating + 1 + data.data.combat.resilence.bonus + data.data.combat.resilence.armor, 1);
        data.data.combat.wounds.max = this._setDefault((data.data.advances.tier * 2) + data.data.attributes.toughness.rating + data.data.combat.wounds.bonus, 1);
        data.data.combat.determination.total = this._setDefault(data.data.attributes.toughness.rating + data.data.combat.determination.bonus, 1);
        data.data.combat.shock.max = this._setDefault(data.data.attributes.willpower.rating + data.data.advances.tier + data.data.combat.shock.bonus, 1);
    }

    _setDefault(value, fallback) {
        return (value < fallback ? fallback : value);
    }

    _computeExperience(data) {
        data.data.advances.experience.spent = data.data.advances.experience.spent + data.data.advances.species;
        data.data.advances.experience.total = data.data.advances.experience.current + data.data.advances.experience.spent;
    }
}
export class WrathAndGloryActor extends Actor {
    prepareData() {
        super.prepareData();
        if (this.data.type === "agent") {
            this._initializeAgent();
        } else if (this.data.type === "threat") {
            this._initializeThreat();
        }
    }

    _initializeAgent() {
        this._initializeBonus();
        this._computeItems();
        this._computeAttributes();
        this._computeSkills();
        this._computeCombat();
        this._computeExperience();
    }

    _initializeThreat(data) {
        this._initializeBonus();
        this._computeItems();
        this._computeAttributes();
        this._computeSkills();
    }

    _initializeBonus() {
        let data = this.data
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

    _computeItems() {
        let data = this.data
        data.data.combat.resilence.armor = 0;
        for (let item of this.items) {

            if (item.isArmour) {
                this._computeArmour(item);
            }
            if (item.data.hasOwnProperty("bonus")) {
                this._computeBonus(item);
            }
            if (data.data.hasOwnProperty("advances") && item.data.hasOwnProperty("cost")) {
                data.data.advances.experience.spent = data.data.advances.experience.spent + item.data.cost;
            }
        }
    }

    _computeArmour(item) {
        if (this.data.data.combat.resilence.armor < item.data.data.rating) {
            this.data.data.combat.resilence.armor = item.data.data.rating;
        }
    }

    _computeAttributes() {
        let data = this.data
        for (let attribute of Object.values(data.data.attributes)) {
            attribute.total = attribute.rating + attribute.bonus;
            if (data.data.hasOwnProperty("advances")) {
                data.data.advances.experience.spent = data.data.advances.experience.spent + attribute.cost;
            }
        }
    }

    _computeBonus(item) {
        let data = this.data
        let bonus = item.data.data.bonus
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

    _computeSkills(item) {
        let data = this.data
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

    _computeCombat() {
        let data = this.data
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

    _computeExperience() {
        let data = this.data
        data.data.advances.experience.spent = data.data.advances.experience.spent + data.data.advances.species;
        data.data.advances.experience.total = data.data.advances.experience.current + data.data.advances.experience.spent;
    }
}
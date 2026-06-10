let fields = foundry.data.fields


/**
 * Base Skill schema
 */
export class SkillField extends foundry.data.fields.SchemaField {
    compute(attributes) {
        this.total = attributes[this.attribute].total + this.rating + this.bonus + this.base
    }

    static createWithAttribute(attribute)
    {
        return new SkillField({
            label: new fields.StringField({ required: true, initial: "" }),
            attribute: new fields.StringField({initial: attribute}),
            rating: new fields.NumberField({ required: true, initial: 0, min: 0 }),
            base: new fields.NumberField({ required: true, initial: 0 }),
            bonus: new fields.NumberField({ required: true, initial: 0 }),
            cost: new fields.NumberField({ required: true, initial: 0 }),
            total: new fields.NumberField({ required: true, initial: 0 }),
        })
    }

}


/**
 * Default Skills used by common actors
 */
export class SkillsModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            athletics: SkillField.createWithAttribute("strength"),
            awareness: SkillField.createWithAttribute("intellect"),
            ballisticSkill: SkillField.createWithAttribute("agility"),
            cunning: SkillField.createWithAttribute("fellowship"),
            deception: SkillField.createWithAttribute("fellowship"),
            insight: SkillField.createWithAttribute("fellowship"),
            intimidation: SkillField.createWithAttribute("willpower"),
            investigation: SkillField.createWithAttribute("intellect"),
            leadership: SkillField.createWithAttribute("willpower"),
            medicae: SkillField.createWithAttribute("intellect"),
            persuasion: SkillField.createWithAttribute("fellowship"),
            pilot: SkillField.createWithAttribute("agility"),
            psychicMastery: SkillField.createWithAttribute("willpower"),
            scholar: SkillField.createWithAttribute("intellect"),
            stealth: SkillField.createWithAttribute("agility"),
            survival: SkillField.createWithAttribute("willpower"),
            tech: SkillField.createWithAttribute("intellect"),
            weaponSkill: SkillField.createWithAttribute("initiative")
        }
    }

    compute(attributes) {
        for(let s in this)
        {
            let skill = this[s];
            skill.total = attributes[skill.attribute].total + skill.rating + skill.bonus + skill.base
        }
    }
}

/**
 * Agent Skills should compute experience: use AgentSkillsModel
 */
export class AgentSkillsModel extends SkillsModel{
    computeCosts(experience) {
        for (let sk in this)
        {
            let skill = this[sk]
            skill.cost = game.wng.utility.getSkillCostTotal(skill.rating + skill.base, skill.base);
            experience.spent += skill.cost;
        }
    }
}

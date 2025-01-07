let fields = foundry.data.fields


/**
 * Base Skill schema
 */
export class SkillModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            label: new fields.StringField({ required: true, initial: "" }),
            attribute: new fields.StringField(),
            rating: new fields.NumberField({ required: true, initial: 0, min: 0 }),
            base: new fields.NumberField({ required: true, initial: 0 }),
            bonus: new fields.NumberField({ required: true, initial: 0 }),
            cost: new fields.NumberField({ required: true, initial: 0 }),
            total: new fields.NumberField({ required: true, initial: 0 }),
        }
    }

    compute(attributes) {
        this.total = attributes[this.attribute].total + this.rating + this.bonus + this.base
    }

}


/**
 * Default Skills used by common actors
 */
export class SkillsModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            athletics: new fields.EmbeddedDataField(SkillModel),
            awareness: new fields.EmbeddedDataField(SkillModel),
            ballisticSkill: new fields.EmbeddedDataField(SkillModel),
            cunning: new fields.EmbeddedDataField(SkillModel),
            deception: new fields.EmbeddedDataField(SkillModel),
            insight: new fields.EmbeddedDataField(SkillModel),
            intimidation: new fields.EmbeddedDataField(SkillModel),
            investigation: new fields.EmbeddedDataField(SkillModel),
            leadership: new fields.EmbeddedDataField(SkillModel),
            medicae: new fields.EmbeddedDataField(SkillModel),
            persuasion: new fields.EmbeddedDataField(SkillModel),
            pilot: new fields.EmbeddedDataField(SkillModel),
            psychicMastery: new fields.EmbeddedDataField(SkillModel),
            scholar: new fields.EmbeddedDataField(SkillModel),
            stealth: new fields.EmbeddedDataField(SkillModel),
            survival: new fields.EmbeddedDataField(SkillModel),
            tech: new fields.EmbeddedDataField(SkillModel),
            weaponSkill: new fields.EmbeddedDataField(SkillModel),
        }
    }

    compute(attributes) {
        for(let skill in this)
            this[skill].compute(attributes);
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

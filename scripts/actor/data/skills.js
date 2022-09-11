


/**
 * Base Skill schema
 */
export class SkillModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            label: new foundry.data.fields.StringField({ required: true, initial: "" }),
            attribute: new foundry.data.fields.StringField(),
            rating: new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            base: new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            bonus: new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            cost: new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            total: new foundry.data.fields.NumberField({ required: true, initial: 0 }),
        }
    }

    compute() {
        this.computeTotal();
    }

    computeTotal() {
        this.total = this.parent.attributes[this.attribute].total + this.rating + this.bonus + this.base
    }
}


/**
 * Agent Skill - Adds experience calculation to compute method
 */
export class AgentSkillModel extends SkillModel {

    compute() {
        super.compute();
        this.computeCost();
    }
    
    computeCost() {
        this.cost = game.wng.utility.getSkillCostTotal(this.rating + this.base, this.base);
        this.parent.experience.spent += this.cost;
    }
}

/**
 * Default Skills used by common actors
 */
export class SkillsModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            athletics: new foundry.data.fields.EmbeddedDataField(SkillModel),
            awareness: new foundry.data.fields.EmbeddedDataField(SkillModel),
            ballisticSkill: new foundry.data.fields.EmbeddedDataField(SkillModel),
            cunning: new foundry.data.fields.EmbeddedDataField(SkillModel),
            deception: new foundry.data.fields.EmbeddedDataField(SkillModel),
            insight: new foundry.data.fields.EmbeddedDataField(SkillModel),
            intimidation: new foundry.data.fields.EmbeddedDataField(SkillModel),
            investigation: new foundry.data.fields.EmbeddedDataField(SkillModel),
            leadership: new foundry.data.fields.EmbeddedDataField(SkillModel),
            medicae: new foundry.data.fields.EmbeddedDataField(SkillModel),
            persuasion: new foundry.data.fields.EmbeddedDataField(SkillModel),
            pilot: new foundry.data.fields.EmbeddedDataField(SkillModel),
            psychicMastery: new foundry.data.fields.EmbeddedDataField(SkillModel),
            scholar: new foundry.data.fields.EmbeddedDataField(SkillModel),
            stealth: new foundry.data.fields.EmbeddedDataField(SkillModel),
            survival: new foundry.data.fields.EmbeddedDataField(SkillModel),
            tech: new foundry.data.fields.EmbeddedDataField(SkillModel),
            weaponSkill: new foundry.data.fields.EmbeddedDataField(SkillModel),
        }
    }

    compute() {
        for(let skill in this)
            skill.compute();
    }
}

/**
 * Agent Skills should compute experience: use AgentSkillsModel
 */
export class AgentSkillsModel extends SkillsModel{
    static defineSchema() {
        return {
            athletics: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            awareness: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            ballisticSkill: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            cunning: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            deception: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            insight: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            intimidation: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            investigation: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            leadership: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            medicae: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            persuasion: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            pilot: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            psychicMastery: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            scholar: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            stealth: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            survival: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            tech: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
            weaponSkill: new foundry.data.fields.EmbeddedDataField(AgentSkillModel),
        }
    }
}

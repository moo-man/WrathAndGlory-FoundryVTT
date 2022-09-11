
/**
 * Base Attribute schema
 */
export class AttributeModel extends foundry.abstract.DataModel {

    static defineSchema() {
        return {
            label:  new foundry.data.fields.StringField({ required: true, initial: "" }),
            rating:  new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            base:  new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            bonus:  new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            cost:  new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            total:  new foundry.data.fields.NumberField({ required: true, initial: 0 }),
        }
    }
    
    compute() {
        this.computeTotal();
    }

    computeTotal() {
        this.total = this.rating + this.bonus + this.base
    }
}


/**
 * Agent Attribute - Adds experience calculation to compute method
 */
export class AgentAttributeModel extends AttributeModel {
    compute() {
        super.compute();
        this.computeCost();
    }

    computeCost() {
        this.cost = game.wng.utility.getAttributeCostTotal(this.rating + this.base, this.base);
        this.parent.experience.spent += this.cost;
    }

}

/**
 * Default Attributes used by common actors
 */
export class DefaultAttributesModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            strength: new foundry.data.fields.EmbeddedDataField(AttributeModel),
            toughness: new foundry.data.fields.EmbeddedDataField(AttributeModel),
            agility: new foundry.data.fields.EmbeddedDataField(AttributeModel),
            initiative: new foundry.data.fields.EmbeddedDataField(AttributeModel),
            willpower: new foundry.data.fields.EmbeddedDataField(AttributeModel),
            intellect: new foundry.data.fields.EmbeddedDataField(AttributeModel),
            fellowship: new foundry.data.fields.EmbeddedDataField(AttributeModel)
        }
    }

    compute() {
        for(let attribute in this)
            attribute.compute();
    }
}

/**
 * Agent Attributes should compute experience: use AgentAttributesModel
 */
export class AgentAttributesModel extends DefaultAttributesModel {
    static defineSchema() {
        return {
            strength: new foundry.data.fields.EmbeddedDataField(AgentAttributeModel),
            toughness: new foundry.data.fields.EmbeddedDataField(AgentAttributeModel),
            agility: new foundry.data.fields.EmbeddedDataField(AgentAttributeModel),
            initiative: new foundry.data.fields.EmbeddedDataField(AgentAttributeModel),
            willpower: new foundry.data.fields.EmbeddedDataField(AgentAttributeModel),
            intellect: new foundry.data.fields.EmbeddedDataField(AgentAttributeModel),
            fellowship: new foundry.data.fields.EmbeddedDataField(AgentAttributeModel)
        }
    }
}
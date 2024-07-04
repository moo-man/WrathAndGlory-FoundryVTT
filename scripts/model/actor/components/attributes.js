
/**
 * Base Attribute schema
 */
export class AttributeModel extends foundry.abstract.DataModel {

    static defineSchema() {
        return {
            label:  new foundry.data.fields.StringField({ required: true, initial: "" }),
            rating:  new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            base:  new foundry.data.fields.NumberField({ required: true, initial: 1 }),
            bonus:  new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            cost:  new foundry.data.fields.NumberField({ required: true, initial: 0 }),
            total:  new foundry.data.fields.NumberField({ required: true, initial: 0 }),
        }
    }
    
    compute() {
        this.total = this.rating + this.bonus + this.base
    }
}


/**
 * Default Attributes used by common actors
 */
export class AttributesModel extends foundry.abstract.DataModel {
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
            this[attribute].compute();
    }
}

/**
 * Agent Attributes should compute experience
 */
export class AgentAttributesModel extends AttributesModel {

    computeCosts(experience) {
        for (let attr in this)
        {
            let attribute = this[attr];
            attribute.cost = game.wng.utility.getAttributeCostTotal(attribute.rating + attribute.base, attribute.base);
            experience.spent += attribute.cost;
        }
    }

}
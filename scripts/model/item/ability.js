import { DamageModel } from "./components/damage";
import { StandardItemModel } from "./components/standard";
import { TestDataModel } from "./components/test";
import { TraitsModel } from "./components/traits";

let fields = foundry.data.fields;

export class AbilityModel extends StandardItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.test = new fields.EmbeddedDataField(TestDataModel)
        schema.effect = new fields.StringField({}),
        schema.cost = new fields.NumberField({min : 0}),
        schema.requirements = new fields.StringField({}),
        schema.display =  new fields.BooleanField({})
        schema.abilityType = new fields.StringField({}),
        schema.traits = new fields.EmbeddedDataField(TraitsModel),
        schema.damage =  new fields.EmbeddedDataField(DamageModel)
        return schema;
    }
}
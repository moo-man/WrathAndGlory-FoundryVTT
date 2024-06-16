import { DamageModel } from "./components/damage";
import { StandardItemModel } from "./components/standard";
import { TestDataModel } from "./components/test";

let fields = foundry.data.fields;

export class PsychicPowerModel extends StandardItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.test = new fields.EmbeddedDataField(TestDataModel)
        schema.damage = new fields.EmbeddedDataField(DamageModel)
        schema.effect = new fields.StringField({}),
        schema.cost = new fields.NumberField({min : 0}),
        schema.dn = new fields.StringField({}),
        schema.activation = new fields.StringField({initial : "action"}),
        schema.duration = new fields.StringField({}),
        schema.range = new fields.StringField({}),
        schema.multiTarget =  new fields.BooleanField({}),
        schema.keywords = new fields.StringField({}),
        schema.prerequisites = new fields.StringField({}),
        schema.potency = new fields.ArrayField(new fields.ObjectField({}))
        return schema;
    }

}
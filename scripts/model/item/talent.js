import { DamageModel } from "./components/damage";
import { StandardItemModel } from "./components/standard";
import { TestDataModel } from "./components/test";

let fields = foundry.data.fields;

export class TalentModel extends StandardItemModel
{

    static defineSchema() 
    {
        {
            let schema = super.defineSchema();
            schema.test = new fields.EmbeddedDataField(TestDataModel),
            schema.damage = new fields.EmbeddedDataField(DamageModel),
            schema.uses = new fields.SchemaField({
                current : new fields.NumberField({nullable: true}),
                max : new fields.StringField()
            })
            schema.effect = new fields.StringField({}),
            schema.cost = new fields.NumberField({min : 0}),
            schema.requirements = new fields.StringField({}),
            schema.display =  new fields.BooleanField({})
            return schema;
        }
    }

}
import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class TalentModel extends StandardItemModel
{

    static defineSchema() 
    {
        {
            let schema = super.defineSchema();
            schema.effect = new fields.StringField({}),
            schema.cost = new fields.NumberField({min : 0}),
            schema.requirements = new fields.StringField({}),
            schema.display =  new fields.BooleanField({})
            return schema;
        }
    }

}
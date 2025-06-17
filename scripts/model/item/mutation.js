import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class MutationModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.mutation"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.effect = new fields.StringField({});
        return schema;
    }

}
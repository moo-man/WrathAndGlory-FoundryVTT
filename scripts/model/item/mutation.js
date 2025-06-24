import { StandardItemModel } from "./components/standard";
import { TestDataModel } from "./components/test";

let fields = foundry.data.fields;

export class MutationModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.mutation"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.test = new fields.EmbeddedDataField(TestDataModel)
        return schema;
    }
}
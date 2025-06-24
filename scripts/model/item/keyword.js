import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class KeywordModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.keyword"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        return schema;
    }

}
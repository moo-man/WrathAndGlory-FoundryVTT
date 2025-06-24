import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class MemorableInjuryModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.memorableInjury"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        return schema;
    }

}
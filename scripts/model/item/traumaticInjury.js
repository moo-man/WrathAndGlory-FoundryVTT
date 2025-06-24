import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class TraumaticInjuryModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.traumaticInjury"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        return schema;
    }

}
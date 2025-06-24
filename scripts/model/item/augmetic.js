import { PhysicalItemModel } from "./components/physical";

let fields = foundry.data.fields;

export class AugmeticModel extends PhysicalItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.augmetic", "WH.Components.physical"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.requirements = new fields.StringField({});
        schema.effect = new fields.StringField({});
        return schema;
    }

}
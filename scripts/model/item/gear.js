import { PhysicalItemModel } from "./components/physical";
import { TestDataModel } from "./components/test";

let fields = foundry.data.fields;

export class GearModel extends PhysicalItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.gear", "WH.Components.physical"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.effect = new fields.StringField({});
        schema.test = new fields.EmbeddedDataField(TestDataModel);
        return schema;
    }

}
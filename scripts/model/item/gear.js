import { PhysicalItemModel } from "./components/physical";

let fields = foundry.data.fields;

export class GearModel extends PhysicalItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.effect = new fields.StringField({});
        return schema;
    }

}
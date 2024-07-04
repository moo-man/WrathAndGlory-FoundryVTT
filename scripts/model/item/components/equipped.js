import { PhysicalItemModel } from "./physical";
let fields = foundry.data.fields;

export class EquippedItemModel extends PhysicalItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.equipped = new fields.BooleanField({});
        return schema;
    }

}
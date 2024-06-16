import { BaseItemModel } from "./base";
let fields = foundry.data.fields;

export class StandardItemModel extends BaseItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.description = new fields.StringField();
        return schema;
    }

}
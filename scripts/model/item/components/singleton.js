import { BaseItemModel } from "./base";
let fields = foundry.data.fields;

export class SingletonItemModel extends foundry.abstract.DataModel
{

    static defineSchema() 
    {
        let schema = {};
        schema.name = new fields.StringField();
        schema.id = new fields.StringField();
        return schema;
    }

}
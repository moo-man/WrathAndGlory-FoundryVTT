import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class KeywordModel extends StandardItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        return schema;
    }

}
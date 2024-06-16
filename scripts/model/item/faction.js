import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class FactionModel extends StandardItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.journal = new fields.StringField({});
        schema.backgrounds = new fields.SchemaField({
            origin : backgroundData(),
            accomplishment : backgroundData(),
            goal : backgroundData()
        });
        schema.objectives = new fields.ArrayField(new fields.StringField());
        return schema;
    }

}

function backgroundData() 
{
    return new fields.ArrayField(new fields.SchemaField({
        name : new fields.StringField(),
        description : new fields.StringField(),
        effect : new fields.StringField()
    }));
}

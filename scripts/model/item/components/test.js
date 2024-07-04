let fields = foundry.data.fields;

export class TestDataModel extends foundry.abstract.DataModel
{

    static defineSchema() 
    {
        let schema = {};
        schema.dn = new fields.StringField({}),
        schema.type = new fields.StringField({}),
        schema.specification = new fields.StringField({})
        return schema;
    }
}
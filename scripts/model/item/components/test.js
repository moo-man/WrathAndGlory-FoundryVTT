let fields = foundry.data.fields;

export class TestDataModel extends foundry.abstract.DataModel
{
    static LOCALIZATION_PREFIXES = ["WH.Components.test"];

    static defineSchema() 
    {
        let schema = {};
        schema.self = new fields.BooleanField(),
        schema.dn = new fields.NumberField({nullable : true}),
        schema.type = new fields.StringField({}),
        schema.specification = new fields.StringField({})
        return schema;
    }
}
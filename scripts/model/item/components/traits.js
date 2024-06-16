let fields = foundry.data.fields;

export class TraitsModel extends foundry.abstract.DataModel
{

    static defineSchema() 
    {
        let schema = {};
        schema.list = new fields.ArrayField(new fields.SchemaField({
            name : new fields.StringField({}),
            rating : new fields.StringField({})
        }))
        return schema;
    }

    has(name)
    {
        return this.list.find(i => i.name == name);
    }

    find(filter)
    {
        return this.list.find(filter);
    }

    filter(filter)
    {
        return this.list.filter(filter);
    }

    concat(traits)
    {
        return this.list.concat(traits);
    }
}
let fields = foundry.data.fields;

export class DocumentReferenceModel extends foundry.abstract.DataModel
{
    static defineSchema() 
    {
        let schema = {};
        schema.id = new fields.StringField();
        schema.id = new fields.StringField();
        return schema;
    }

    getDocument(collection) 
    {
        if (collection instanceof Collection)
        {
            this.document = collection.get(this.id);
        }
        else if (collection instanceof Array)
        {
            this.document = collection.find(i => i.id == this.id);
        }
    }
}

export class DeferredDocumentReferenceModel extends DocumentReferenceModel
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.name = new fields.StringField();
        return schema;
    }
}

export class DiffDocumentReferenceModel extends DeferredDocumentReferenceModel
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.diff = new fields.ObjectField();
        return schema;
    }
}
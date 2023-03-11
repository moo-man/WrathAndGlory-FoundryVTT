import { DocumentReferenceModel } from "./reference";

let fields = foundry.data.fields;


// Generic list of objects
export class ListModel extends foundry.abstract.DataModel
{
    defaultValue = undefined;

    static defineSchema() 
    {
        let schema = {};
        schema.list = new fields.ArrayField(new fields.ObjectField());
        return schema;
    }

    add(value)
    {
        return this.list.concat(value || this.defaultValue);
    }

    edit(index, value)
    {
        let list = duplicate(this.list);
        if (typeof value == "object")
        {
            mergeObject(list[index], value, {overwrite : true});
        }
        else if (typeof value == "string")
        {
            list[index] = value;
        }
        return list;
    }

    remove(index)
    {
        index = Number(index);
        return this.list.slice(0, index).concat(this.list.slice(index+1));
    }
}

// List of objects that reference some embedded document on the parent
export class DocumentListModel extends ListModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.list = new fields.ArrayField(new fields.EmbeddedDataField(DocumentReferenceModel));
        return schema;
    }

    addDocument(document)
    {
        if (document.prototypeToken?.actorLink && this.has(id))
        {
            return this.list
        }
        else 
        {
            return this.list.concat([{id : document.id}])
        }
    }

    editId(id, value)
    {
        let index = this.list.findIndex(i => i.id == id);
        return this.edit(index, value);
    }

    has(id)
    {
        return !!this.list.find(i => i.id == id)
    }

    removeId(id) 
    {
        let index = this.list.findIndex(i => i.id == id);

        if (index != -1) {return this.remove(index);}
        else {return this.list;}
    }

    findDocuments(collection) 
    {
        this.list.forEach(i => i.document = collection.get(i.id));
    }
}

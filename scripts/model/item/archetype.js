import { Attributes, BaseItemModel, Skills } from "./components/base";

let fields = foundry.data.fields;

export class ArchetypeModel extends BaseItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.tier = new fields.NumberField({min : 1, initial : 1})
        schema.journal = new fields.StringField({});
        schema.species = new fields.EmbeddedDataField(DocumentReferenceModel);
        schema.faction = new fields.EmbeddedDataField(DocumentReferenceModel);
        schema.influence = new fields.NumberField({initial : 0});
        schema.cost = new fields.NumberField({min : 0, initial : 0});
        schema.keywords = new fields.ArrayField(new fields.StringField());
        schema.attributes = Attributes();
        schema.skills = Skills();
        schema.ability = new fields.EmbeddedDataField(DeferredReferenceModel)
        schema.wargear = new fields.ArrayField(new fields.EmbeddedDataField(ArchetypeWargearModel))
        schema.groups = new fields.SchemaField({
            type : new fields.StringField({initial : "and"}),
            groupId : new fields.StringField({initial : "root"}),
            items : new fields.ArrayField(new fields.ObjectField())
        })
        schema.suggested = new fields.SchemaField({
            attributes : Attributes(),
            skills: Skills(),
            // talents : new fields.ArrayField(new fields.EmbeddedDataField(DiffDocumentReferenceModel))
        })
        return schema;
    }
}


class ArchetypeWargearModel extends DeferredReferenceModel 
{
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.type = new fields.StringField();
        schema.filters = new fields.ArrayField(new fields.SchemaField({
            test : new fields.StringField(),
            property : new fields.StringField(),
            value : new fields.StringField(),
        }))
        return schema;
    }
}
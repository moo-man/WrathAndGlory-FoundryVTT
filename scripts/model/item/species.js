import { Attributes, Skills } from "./components/base";
import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class SpeciesModel extends StandardItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.cost = new fields.NumberField({min : 0, initial : 0});
        schema.speed = new fields.NumberField({min : 1, initial : 6})
        schema.size = new fields.StringField({});
        schema.journal = new fields.StringField({});
        schema.abilities = new fields.EmbeddedDataField(DeferredReferenceListModel)
        schema.attributes = Attributes();
        schema.skills = Skills();
        schema.attributeMax = Attributes();
        return schema;
    }
}
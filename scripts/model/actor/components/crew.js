import { DocumentListModel } from "../../shared/list";
import { DocumentReferenceModel } from "../../shared/reference";
let fields = foundry.data.fields

// List of objects that reference some embedded document on the parent
export class VehicleComplement extends DocumentListModel {
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.pilot = new fields.NumberField()
        schema.crew = new fields.NumberField()
        schema.passenger = new fields.NumberField()
        schema.list = new fields.ArrayField(new fields.EmbeddedDataField(VehicleCrew));
        return schema;
    }
}

export class VehicleCrew extends DocumentReferenceModel 
{
    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.type = new fields.StringField();
        return schema;
    }
}
import { PhysicalItemModel } from "./components/physical";
import { TraitsModel } from "./components/traits";

let fields = foundry.data.fields;

export class WeaponUpgradeModel extends PhysicalItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.effect = new fields.StringField({});
        schema.traits = new fields.EmbeddedDataField(TraitsModel);
        return schema;
    }

}
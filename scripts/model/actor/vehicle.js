import { BaseWnGActorModel } from "./components/base";
import { VehicleComplement } from "./components/crew";
import { VehicleCombatModel } from "./components/vehicle-combat";

const fields = foundry.data.fields;

export class VehicleModel extends BaseWnGActorModel {
    static defineSchema() {
        let schema = super.defineSchema();
        schema.complement = new fields.EmbeddedDataField(VehicleComplement);
        schema.mnvr = new fields.NumberField();
        schema.rarity = new fields.StringField();
        schema.value = new fields.NumberField();
        schema.traits = new fields.ArrayField(new fields.ObjectField());
        schema.combat = new fields.EmbeddedDataField(VehicleCombatModel)
        schema.notes = new fields.StringField()

        return schema;
    }

    computeBase() {
        super.computeBase();
        this.complement.findDocuments(game.actors);        
    }

    computeDerived(items, autoCalc)
    {

    }
}

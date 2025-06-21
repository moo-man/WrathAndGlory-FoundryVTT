import { TraitsModel } from "../item/components/traits";
import { VehicleComplement } from "./components/crew";
import { VehicleCombatModel } from "./components/vehicle-combat";

const fields = foundry.data.fields;

export class VehicleModel extends BaseWarhammerActorModel {
    static defineSchema() {
        let schema = super.defineSchema();
        schema.complement = new fields.EmbeddedDataField(VehicleComplement);
        schema.mnvr = new fields.NumberField();
        schema.rarity = new fields.StringField();
        schema.value = new fields.NumberField();
        schema.traits = new fields.EmbeddedDataField(TraitsModel)
        schema.combat = new fields.EmbeddedDataField(VehicleCombatModel)
        schema.notes = new fields.HTMLField()

        schema.settings = new foundry.data.fields.SchemaField({
            hidePassengers : new foundry.data.fields.BooleanField(),
        })

        return schema;
    }

    computeBase() {
        super.computeBase();
    }

    computeDerived()
    {
        let pilot = this.complement.activePilot
        let pilotInit = (pilot?.system.attributes.initiative.total || 0)
        this.combat.defence.total = Math.min(pilotInit, this.mnvr) + this.combat.defence.bonus;
    }

    get traitsAvailable() {
        return game.wng.config.vehicleTraits
    }

    static migrateData(data)
    {
        super.migrateData(data);
        if (data.traits instanceof Array)
        {
            data.traits = {list : data.traits};
        }
    }
}

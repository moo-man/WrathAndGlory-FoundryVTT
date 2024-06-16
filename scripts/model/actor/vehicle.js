import { BaseActorModel } from "./components/base";
import { VehicleComplement } from "./components/crew";
import { VehicleCombatModel } from "./components/vehicle-combat";

const fields = foundry.data.fields;

export class VehicleModel extends BaseActorModel {
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
        
        this.traits.forEach(i => {
                i.display = game.wng.config.vehicleTraits[i.name];
                if (game.wng.config.traitHasRating[i.name]) {
                    i.display += ` (${i.rating})`
                }
            }
        )
    }

    computeDerived()
    {

    }

    
    get displayTraits() {
        return Object.values(this.traits).map(i => i.display).join(", ")
    }
}

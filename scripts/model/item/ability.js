import { DamageModel } from "./components/damage";
import { StandardItemModel } from "./components/standard";
import { TestDataModel } from "./components/test";
import { TraitsModel } from "./components/traits";

let fields = foundry.data.fields;

export class AbilityModel extends StandardItemModel
{

    get traitsAvailable() {
        return game.wng.config.weaponTraits
    }

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.test = new fields.EmbeddedDataField(TestDataModel)
        schema.effect = new fields.StringField({}),
        schema.cost = new fields.NumberField({min : 0}),
        schema.requirements = new fields.StringField({}),
        schema.display =  new fields.BooleanField({})
        schema.abilityType = new fields.StringField({}),
        schema.traits = new fields.EmbeddedDataField(TraitsModel),
        schema.damage =  new fields.EmbeddedDataField(DamageModel)
        return schema;
    }

    get AbilityType() {
        return game.wng.config.abilityTypes[this.abilityType]
    }

    getOtherEffects()
    {
        return super.getOtherEffects().concat(this.traits.effects);
    }

}
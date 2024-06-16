import { DamageModel } from "./components/damage";
import { EquippedItemModel } from "./components/equipped";
import { TraitsModel } from "./components/traits";

let fields = foundry.data.fields;

export class WeaponModel extends EquippedItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.attack = new fields.SchemaField({
            base : new fields.NumberField({}),
            bonus : new fields.NumberField({}),
            rank : new fields.StringField({initial : "none"}),
        })
        schema.damage = new fields.EmbeddedDataField(DamageModel);
        schema.category = new fields.StringField({initial : "melee"});
        schema.range = new fields.SchemaField({
            short : new fields.NumberField({}),
            medium : new fields.NumberField({}),
            long : new fields.NumberField({}),
            melee : new fields.NumberField({initial : 1}),
            thrown : new fields.NumberField({nullable : true}),
        })
        schema.category = new fields.StringField({initial : "melee"});
        schema.ammo = new fields.StringField({})
        schema.salvo = new fields.NumberField({})
        schema.traits = new fields.EmbeddedDataField(TraitsModel);
        schema.upgrades = new fields.ArrayField(new fields.ObjectField());
        return schema;
    }

}
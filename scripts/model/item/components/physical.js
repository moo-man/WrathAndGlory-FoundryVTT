import { StandardItemModel } from "./standard";
let fields = foundry.data.fields;

export class PhysicalItemModel extends StandardItemModel
{

    get traitsAvailable() {
        return game.wng.config.weaponTraits
    }

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.quantity = new fields.NumberField({min : 0});
        schema.value = new fields.StringField();
        schema.keywords = new fields.StringField();
        schema.rarity = new fields.StringField({initial : "common"});
        return schema;
    }

    get Rarity() {
        return game.wng.config.rarity[this.rarity]
    }

}
import { StandardItemModel } from "./standard";
let fields = foundry.data.fields;

export class PhysicalItemModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Components.physical"];

    get traitsAvailable() {
        return game.wng.config.weaponTraits
    }

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.quantity = new fields.NumberField({initial : 1, min : 0});
        schema.value = new fields.NumberField({min: 0});
        schema.keywords = new fields.StringField();
        schema.rarity = new fields.StringField({initial : "common"});
        return schema;
    }

    get Rarity() {
        return game.wng.config.rarity[this.rarity] || "-";
    }

}
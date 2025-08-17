import { EquippedItemModel } from "./components/equipped";
import { TraitsModel } from "./components/traits";

let fields = foundry.data.fields;

export class ArmourModel extends EquippedItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.armour", "WH.Components.physical"];
    
    get traitsAvailable()
    {
        return game.wng.config.armourTraits;
    }

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.rating = new fields.NumberField({min : 0});
        schema.base = new fields.NumberField({min : 0});
        schema.traits = new fields.EmbeddedDataField(TraitsModel);
        schema.invulnerable = new fields.BooleanField({});
        return schema;
    }

    getOtherEffects()
    {
        return super.getOtherEffects().concat(this.traits.effects);
    }

    async toEmbed(config, options)
    {
        let html = `
        <h4>@UUID[${this.parent.uuid}]{${this.parent.name}}</h4>
        ${this.description}
        <p><strong>Value</strong>: ${this.value}</p>
        <p><strong>Rarity</strong>: ${this.Rarity}</p>
        <p><strong>Keywords</strong>: ${this.keywords.split(",").map(i => `<a class="keyword">${i.trim()}</a>`).join(", ")}</p>
        `;
    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }

}
import { PhysicalItemModel } from "./components/physical";

let fields = foundry.data.fields;

export class AugmeticModel extends PhysicalItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.augmetic", "WH.Components.physical"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.requirements = new fields.StringField({});
        schema.effect = new fields.StringField({});
        return schema;
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
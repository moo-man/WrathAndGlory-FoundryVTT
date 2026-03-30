import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class AscensionModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.ascension"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.cost = new fields.NumberField({min : 0});
        schema.requirements = new fields.StringField({});
        schema.keywords = new fields.StringField({});
        schema.influence = new fields.NumberField({});
        schema.benefits = new fields.HTMLField({});
        return schema;
    }

    async toEmbed(config, options)
    {
        let html = `
        <h4>@UUID[${this.parent.uuid}]{${this.parent.name}}</h4>
        <p><strong>XP Cost</strong>: ${this.cost}</p>
        <p><strong>Requirements</strong>: ${this.requirements}</p>
        ${this.description.replace("<p>", "<p><strong>Effect</strong>: ")}</p>
        ${this.benefits}
        `;

    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }


}
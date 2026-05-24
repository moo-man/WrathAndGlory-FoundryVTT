import { DamageModel } from "./components/damage";
import { StandardItemModel } from "./components/standard";
import { TestDataModel } from "./components/test";
import { TraitsModel } from "./components/traits";

let fields = foundry.data.fields;

export class AbilityModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.ability", "WH.Components.damage"];

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

    async toEmbed(config, options)
    {
        let html = `
        <h4>@UUID[${this.parent.uuid}]{${this.parent.name}}</h4>
        ${this.description}</p>
        `;
    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }
}
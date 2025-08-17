import { DamageModel } from "./components/damage";
import { StandardItemModel } from "./components/standard";
import { TestDataModel } from "./components/test";
import { TraitsModel } from "./components/traits";

let fields = foundry.data.fields;

export class TalentModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.talent"];

    static defineSchema() 
    {
        {
            let schema = super.defineSchema();
            schema.test = new fields.EmbeddedDataField(TestDataModel),
            schema.damage = new fields.EmbeddedDataField(DamageModel),
            schema.traits = new fields.EmbeddedDataField(TraitsModel),
            schema.uses = new fields.SchemaField({
                current : new fields.NumberField({nullable: true}),
                max : new fields.StringField()
            })
            schema.effect = new fields.StringField({}),
            schema.cost = new fields.NumberField({min : 0}),
            schema.requirements = new fields.StringField({}),
            schema.display =  new fields.BooleanField({})
            return schema;
        }
    }

    get isMelee() 
    {
        return this.test.skill == "weaponskill"
    }

    get isRanged() 
    {
        return this.test.skill == "ballisticSkill"
    }

    async toEmbed(config, options)
    {
        let html = `
        <h4>@UUID[${this.parent.uuid}]{${this.parent.name}}</h4>
        <p><strong>XP Cost</strong>: ${this.cost}</p>
        <p><strong>Requirements</strong>: ${this.requirements}</p>
        ${this.description.replace("<p>", "<p><strong>Effect</strong>: ")}</p>
        `;
    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }

}
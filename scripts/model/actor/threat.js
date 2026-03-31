import { StandardWNGActorModel } from "./components/standard";

let fields = foundry.data.fields;

export class ThreatModel extends StandardWNGActorModel {

    static defineSchema() {
        let schema = super.defineSchema();

        schema.bio = new fields.SchemaField({
            species: new fields.StringField(),
            faction: new fields.StringField(),
            archetype: new fields.StringField(),
            threat: new fields.SchemaField({
                first: new fields.StringField({ default: "T" }),
                second: new fields.StringField({ default: "T" }),
                third: new fields.StringField({ default: "T" }),
                fourth: new fields.StringField({ default: "T" }),
                fifth: new fields.StringField({ default: "T" })
            }),
            
        })
        schema.notes = new fields.HTMLField(),
        schema.mob = new fields.EmbeddedDataField(MobModel);
        // schema.mob = new fields.SchemaField({
        //     value : new fields.NumberField({min: 0}),
        //     abilities : new fields.EmbeddedDataField(DocumentReferenceListModel),
        // });
        schema.resources = new fields.SchemaField({
            ruin : new fields.NumberField({min : 0}),
        })
        return schema;
    }

    static migrateData(data)
    {
        super.migrateData(data);
        if (typeof data.mob == "number")
        {
            data.mob = {value : data.mob, abilities : []}
        }
    }

    _addModelProperties()
    {
        super._addModelProperties();
        this.mob.abilities.relative = this.parent.items;
    }

    async toEmbed(config, options)
    {

        let skillsText = Object.keys(this.skills).filter(i => this.skills[i].base).map(i => `${game.wng.config.skills[i]} ${this.skills[i].base}`).join(", ");

        let description = this.notes;

        let img = this.parent.img;

        if (config.token)
        {
            img = this.parent.prototypeToken.texture.src
        }

        img = `<div class="journal-image centered"><img src="${img}" width=300/></div>`

        let html = `
        <div class="table-border">
        <table>
        <tbody>
        <tr class="threat-header">
            <td colspan="14">
                <p>@UUID[${this.parent.uuid}]{${this.parent.name}}</p>
            </td>
        </tr>
        <tr>
            <td class="threat-label" colspan="2">
                <p>Threat</p>
            </td>
            <td class="threat-value" colspan="4">
                <p>${this.bio.threat.first}|${this.bio.threat.second}|${this.bio.threat.third}|${this.bio.threat.fourth}|${this.bio.threat.fifth}</p>
            </td>
            <td class="threat-value" colspan="8">
                ${this.parent.itemTypes.keyword.map(i => `<a class="keyword">${i.name}</a>`).join(", ")}
            </td>
        </tr>
        <tr class="attributes">
        ${Object.keys(this.attributes).map(a => {
            return `<td colspan="2">
                <div class="attribute">
                    <span>${game.wng.config.attributeAbbrev[a]}</span>
                    <span>${this.attributes[a].total}</span>
                </div>
            </td>`
        }).join("")}
        </tr>
        <tr class="table-col-header combat">
            <td class="threat-label" colspan="3">Defence</span>
            <td class="threat-label" colspan="3">Wounds</span>
            <td class="threat-label" colspan="3">Shock</span>
            <td class="threat-label" colspan="5">Resilience</span>
        </tr>
        <tr class="combat">
            <td colspan="3">${this.combat.defence.total}</td>
            <td colspan="3">${this.combat.wounds.max}</td>
            <td colspan="3">${this.combat.shock.max}</td>
            <td colspan="5">${this.combat.resilience.total} (${this.combat.resilience.armour} AR)</td>
        </tr>
        <tr class="skills">
            <td colspan="14"><p><strong>SKILLS</strong>: ${skillsText}</p>
        </tr>
        <tr class="separator">
            <td colspan="14">TALENTS</span>
        </tr>
        <tr class="talents">
            <td colspan="14">${this.parent.itemTypes.talent.map(i => `@UUID[${i.uuid}]{${i.name}}`).join(", ")}</span>
        </tr>
        <tr class="separator">
            <td colspan="14">EQUIPMENT</span>
        </tr>
        <tr class="equipment">
            <td colspan="14">${this.parent.items.contents.filter(i => i.system.isPhysical).map(i => `@UUID[${i.uuid}]{${i.name}}`).join(", ")}</span>
        </tr>
        <tr class="separator">
            <td colspan="14">ABILITIES</span>
        </tr>
        <tr class="abilties">
            <td colspan="14">${this.parent.itemTypes.ability.map(i => `<p>@UUID[${i.uuid}]{${i.name}}: ${i.system.description.replace("<p>", "")}`).join("")}</span>
        </tr>
        <tr class="determination">
            <td colspan="14"><p><strong>DETERMINATION</strong>: Spend 1 Ruin to roll ${this.combat.determination.total}d6</p>
        </tr>
        <tr class="table-col-header combat">
            <td class="threat-label" colspan="3">Conviction</span>
            <td class="threat-label" colspan="3">Resolve</span>
            <td class="threat-label" colspan="3">Speed</span>
            <td class="threat-label" colspan="5">Size</span>
        </tr>
        <tr class="combat">
            <td colspan="3">${this.combat.conviction.total}</span>
            <td colspan="3">${this.combat.resolve.total}</span>
            <td colspan="3">${this.combat.speed}</span>
            <td colspan="5">${game.wng.config.size[this.combat.size]}</span>
        </tr>
       `

        html += `</tbody></table></div>`;

        if (config.description == "top")
        {
            html = description + html;
        }
        else if (config.description == "bottom")
        {
            html += description
        }

        if (config.image == "top")
        {
            html = img + html;
        }
        else if (config.image == "bottom")
        {
            html += img
        }
        

        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(html, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }

}

class MobModel extends foundry.abstract.DataModel
{
    static defineSchema()
    {
        let schema = {};
        schema.value = new fields.NumberField({min: 0});
        schema.abilities = new fields.EmbeddedDataField(MobAbilities);
        return schema;
    }

    isMobAbility(item)
    {
        return this.abilities.list.find(i => i.id == item.id);
    }

    isActiveMobAbility(item)
    {
        return this.abilities.list.find(i => i.id == item.id)?.requiredMob <= this.value;
    }
}


class MobAbility extends DocumentReferenceModel
{
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.requiredMob = new fields.NumberField({min: 0});
        return schema;
    }
}

class MobAbilities extends DocumentReferenceListModel
{
    static listSchema = MobAbility
    static defineSchema()
    {
        let schema = super.defineSchema();
        return schema;
    }
}
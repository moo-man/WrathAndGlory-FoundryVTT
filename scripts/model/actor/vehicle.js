import { TraitsModel } from "../item/components/traits";
import { VehicleComplement } from "./components/crew";
import { VehicleCombatModel } from "./components/vehicle-combat";

const fields = foundry.data.fields;

export class VehicleModel extends BaseWarhammerActorModel {
    static defineSchema() {
        let schema = super.defineSchema();
        schema.complement = new fields.EmbeddedDataField(VehicleComplement);
        schema.mnvr = new fields.NumberField();
        schema.rarity = new fields.StringField();
        schema.value = new fields.NumberField();
        schema.traits = new fields.EmbeddedDataField(TraitsModel)
        schema.combat = new fields.EmbeddedDataField(VehicleCombatModel)
        schema.notes = new fields.HTMLField()

        schema.settings = new foundry.data.fields.SchemaField({
            hidePassengers : new foundry.data.fields.BooleanField(),
        })

        return schema;
    }

    computeBase() {
        super.computeBase();
    }

    computeDerived()
    {
        let pilot = this.complement.activePilot
        let pilotInit = (pilot?.system.attributes.initiative.total || 0)
        this.combat.defence.total = Math.min(pilotInit, this.mnvr) + this.combat.defence.bonus;
    }

    get traitsAvailable() {
        return game.wng.config.vehicleTraits
    }

    async toEmbed(config, options)
    {
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
            <td class="threat-label" style="text-align: center" colspan="7">
                <p>Speed</p>
            </td>
            <td class="threat-label" style="text-align: center" colspan="7">
                <p>Manoeuvrability</p>
            </td>
        </tr>
        <tr>
            <td class="threat-value" colspan="7">
                <p>${this.combat.speed}</p>
            </td>
            <td class="threat-value" colspan="7">
                <p>${this.mnvr}</p>
            </td>
        </tr>
        <tr>
            <td class="threat-label" style="text-align: center" colspan="7">
                <p>Resilience</p>
            </td>
            <td class="threat-label" style="text-align: center" colspan="7">
                <p>Wounds</p>
            </td>
        </tr>
        <tr>
        <td class="threat-value" colspan="7">
            <p>${this.combat.resilience.total}</p>
            </td>
            <td class="threat-value" colspan="7">
                <p>${this.combat.wounds.max}</p>
            </td>
        </tr>
        <tr>
            <td class="threat-label" style="text-align: center" colspan="7">
                <p>Size</p>
            </td>
            <td class="threat-value" colspan="7">
                <p>${game.wng.config.size[this.combat.size]}</p>
            </td>
        </tr>
        <tr class="separator">
            <td colspan="14">KEYWORDS</td>
        </tr>
        <tr class="talents">
            <td colspan="14">${this.parent.itemTypes.keyword.map(i => `<a class="keyword">${i.name}</a>`).join(", ")}</td>
        </tr>
        <tr class="separator">
            <td colspan="14">WARGEAR</td>
        </tr>
        <tr class="equipment">
            <td colspan="14">${this.parent.items.contents.filter(i => i.system.isPhysical && i.type != "weapon").map(i => `@UUID[${i.uuid}]{${i.name}}`).join(", ")}</td>
        </tr>
        <tr class="separator">
            <td colspan="14">WEAPONS</td>
        </tr>
        <tr class="weapons">
            <td colspan="14">${this.parent.itemTypes.weapon.map(i => `<p>@UUID[${i.uuid}]{${i.name}}</p>`).join("")}</td>
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


    static migrateData(data)
    {
        data = super.migrateData(data);
        if (data.traits instanceof Array)
        {
            data.traits = {list : data.traits};
        }
        return data;
    }
}

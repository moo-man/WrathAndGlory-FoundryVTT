import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class FactionModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.faction"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.journal = new fields.StringField({});
        schema.backgrounds = new fields.SchemaField({
            origin : backgroundData(),
            accomplishment : backgroundData(),
            goal : backgroundData()
        });
        schema.objectives = new fields.ArrayField(new fields.StringField());
        return schema;
    }

    shouldTransferEffect(effect)
    {
        if (effect.getFlag(game.system.id, "forceTransfer"))
        {
            return true;
        }

        for (let bg of this.backgrounds.origin.concat(this.backgrounds.accomplishment).concat(this.backgrounds.goal))
        {
            if (bg.chosen && bg.effect.id == effect.id && !effect.changes.some(c => c.mode == 0))
            {
                return true;
            }
        }
        return false
    }

    _addModelProperties()
    {
        for (let bg of this.backgrounds.origin.concat(this.backgrounds.accomplishment).concat(this.backgrounds.goal))
        {
            bg.effect.relative = this.parent.effects;
        }
    }

    static migrateData(data)
    {
        super.migrateData(data);
        for(let bg of (data.backgrounds?.origin || []))
        {
            if (typeof bg.effect == "string")
            {
                bg.effect = {id : bg.effect}
            }
        }
        for(let bg of (data.backgrounds?.accomplishment || []))
        {
            if (typeof bg.effect == "string")
            {
                bg.effect = {id : bg.effect}
            }
        }
        for(let bg of (data.backgrounds?.goal || []))
        {
            if (typeof bg.effect == "string")
            {
                bg.effect = {id : bg.effect}
            }
        }
    }



    async toEmbed(config, options)
    {
        let localization = {
            "origin" : game.i18n.localize("FACTION.ORIGIN"),
            "accomplishment" : game.i18n.localize("FACTION.ACCOMPLISHMENT"),
            "goal" : game.i18n.localize("FACTION.GOAL"),
        }

        const listBackgrounds = (bg) => 
        {

            let bgList = this.backgrounds[bg];

            if (!bgList.length)
            {
                return "";
            }

            let bgHTML = `
            <tr class="table-col-header">
                <td>
                    <p>[[/r d${bgList.length}]]</p>
                </td>
                <td>
                    <p>${localization[bg]}</p>
                </td>
                <td>
                    <p>Gain +1</p>
                </td>
            </tr>`

            for (let i = 0; i < bgList.length; i++)
            {
                let bgData = bgList[i];
                bgHTML += `
                <tr>
                    <td>
                        <p>${i + 1}</p>
                    </td>
                    <td>
                        <p><strong>${bgData.name}</strong>: ${bgData.description}</p>
                    </td>
                    <td>
                        <p>${bgData.effect.document.name}</p>
                    </td>
                </tr>`
            }

            return bgHTML;
        }

        let html = `
        <table border="1" class="backgrounds">
            <tbody>
                <tr class="table-header ${config.species}">
                    <td colspan="3">
                        <p>@UUID[${this.parent.uuid}]{${this.parent.name}} BACKGROUNDS</p>
                    </td>
                </tr>
                ${listBackgrounds("origin")}
                ${listBackgrounds("accomplishment")}
                ${listBackgrounds("goal")}
            </tbody>
        </table>
        `;

        html += 

        `
        <table border="1" class="objectives">
            <tbody>
                <tr class="table-header ${config.species}">
                    <td colspan="2">
                        <p>@UUID[${this.parent.uuid}]{${this.parent.name}} OBJECTIVES</p>
                    </td>
                </tr>
                <tr class="table-col-header">
                    <td>
                        <p>[[/r d${this.objectives.length}]]</p>
                    </td>
                    <td>
                        <p>Objective</p>
                    </td>
                </tr>
                ${this.objectives.map((o, index) => {
                    return `
                    <tr>
                        <td>
                            <p>${index + 1}</p>
                        </td>
                        <td>
                            <p>${o}</p>
                        </td>
                    </tr>`
                }).join("")}
            </tbody>
        </table>
        `
    
        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }

}

function backgroundData() 
{
    return new fields.ArrayField(new fields.SchemaField({
        name : new fields.StringField(),
        description : new fields.StringField(),
        effect : new fields.EmbeddedDataField(DocumentReferenceModel),
        active : new fields.BooleanField(),
        chosen : new fields.BooleanField()
    }));
}

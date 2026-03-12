import CharacterCreation from "../../apps/character-creation";
import { Attributes, BaseItemModel, Skills } from "./components/base";

let fields = foundry.data.fields;

export class ArchetypeModel extends BaseItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.archetype"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.tier = new fields.NumberField({min : 1, initial : 1})
        schema.journal = new fields.StringField({});
        schema.species = new fields.EmbeddedDataField(DeferredReferenceModel);
        schema.faction = new fields.EmbeddedDataField(DeferredReferenceModel);
        schema.influence = new fields.NumberField({initial : 0});
        schema.cost = new fields.NumberField({min : 0, initial : 0});
        schema.keywords = new fields.ArrayField(new fields.StringField());
        schema.attributes = Attributes();
        schema.skills = Skills();
        schema.ability = new fields.EmbeddedDataField(DeferredReferenceModel) // Deprecated in favor of abilities
        schema.abilities = new fields.EmbeddedDataField(DeferredReferenceListModel)
        schema.wargear = new fields.EmbeddedDataField(ChoiceModel)
        schema.suggested = new fields.SchemaField({
            attributes : Attributes(),
            skills: Skills(),
            talents : new fields.EmbeddedDataField(DeferredReferenceListModel)
        })
        return schema;
    }

    async _onCreate(data, options, user)
    {
        await super._onCreate(data, options, user);
        if (game.user.id != user)
        {
            return;
        }

        if (this.parent.isOwned && !options.appliedArchetype)
        {
            let actor = this.parent.actor;

            if (["agent", "threat"].includes(actor.type))
            {
                this.promptArchetype(actor);
            }
        }
    }

    async promptArchetype(actor) {
        if (await foundry.applications.api.Dialog.confirm({
            window: {title: "Apply Archetype"},
            content: actor.type == "agent" ? "<p>Begin Character Creation?</p>" : "<p>Apply Archetype?</p>",
        }))
        {
            this.applyArchetypeTo(actor)
        }
        else 
        {
            let species = await warhammer.utility.findItemId(this.species.id, "species")
            let faction = await warhammer.utility.findItemId(this.faction.id, "faction")
            actor.createEmbeddedDocuments("Item", [this.parent.toObject(), faction?.toObject(), species?.toObject()].filter(i => i))
        }
    }

    async applyArchetypeTo(actor) {

        let archetype = this.parent;
        if (actor.type == "agent") // If agent, start character creation
        {
            new CharacterCreation({ actor, archetype: this.parent }).render(true)
        }
        else if (actor.type == "threat") // If threat, apply archetype statistics
        {
            ui.notifications.info(`Applying ${archetype.name} Archetype`)
            let actorData = actor.toObject();

            let items = await archetype.GetArchetypeItems()
            let faction = items.find(i => i.type == "faction")
            let species = items.find(i => i.type == "species")
            faction.effects = [];
            actorData.system.combat.speed = species.system.speed;
            actorData.system.combat.size = species.system.size;


            for(let attr in archetype.attributes)
            {
                let attribute = actorData.system.attributes[attr]
                if (archetype.attributes[attr])
                    attribute.base = archetype.attributes[attr]

                if (archetype.suggested.attributes[attr] > attribute.base)
                    attribute.rating = archetype.suggested.attributes[attr] - attribute.base
            }

            for(let sk in archetype.skills)
            {
                let skill = actorData.system.skills[sk]
                if (archetype.skills[sk])
                    skill.base = archetype.skills[sk]

                if (archetype.suggested.skills[sk] > skill.base)
                    skill.rating = archetype.suggested.skills[sk] - skill.base
            }


            // Remove IDs so items work within the update method
            items.forEach(i => delete i._id)

            actorData.name = archetype.name;
            actorData.img = archetype.img;
            actorData.prototypeToken.texture.src = archetype.img.replace("images", "tokens").replace("actors", "tokens")

            await actor.update(actorData)

            // Add items separately so active effects get added seamlessly
            actor.createEmbeddedDocuments("Item", items, {appliedArchetype : true})
        }
    }

    static migrateData(data)
    {
        super.migrateData(data);
        if (data.suggested.talents instanceof Array)
        {
            data.suggested.talents = {list : data.suggested.talents};
        }

        if (!data.abilities || data.abilities.length == 0 && (data.ability?.uuid || data.ability?.id))
        {
            data.abilities = {list: [{uuid : data.ability.uuid, id : data.ability.id, name : data.ability.name}]};
        }


        let _convertStructure = (structure, wargear) => {
            structure.type = ["or", "and"].includes(structure.type) ? structure.type : "option";
            if (!isNaN(structure.index))
            {
                structure.id = wargear[structure.index].groupId || wargear[structure.index].id || structure.groupId;
                if (wargear[structure.index])
                {
                    wargear[structure.index].groupId = structure.id;
                }
            }
            else 
            {
                structure.id = structure.groupId;
            }
            if (structure.items?.length)
            {
                structure.options = foundry.utils.deepClone(structure.items);
                delete structure.items;
                for(let opt of structure.options)
                {
                    _convertStructure(opt, wargear);
                }
            }
            
            return structure
        }

        if (data.wargear instanceof Array)
        {
            let oldWargear = foundry.utils.deepClone(data.wargear);

            data.wargear = {
                structure : _convertStructure(data.groups, oldWargear),
                
                options: oldWargear.map(w => {
                    let type = w.type;
                    if (type == "generic")
                    {
                        type = w.filters?.length ? "filter" : "placeholder";
                    }
                    return {
                        name : w.name,
                        type : type,
                        id : w.groupId || w.id,
                        diff : w.diff,
                        documentId : w.id,
                        idType : "id",
                        filters: (w.filters || []).map(i => {
                            let opMap = {
                                lt : "<",
                                le : "<=",
                                eq : "==",
                                gt : ">",
                                ge : ">="
                            }
                            if (i.property.includes("hasKeyword"))
                            {
                                return {
                                    path : "keywords",
                                    value : i.property.split("\"")[1].split("").filter(i => i != "").join(""),
                                    operation : "includes"
                                }
                            }
                            return {
                                path : i.property,
                                value : i.value,
                                operation : opMap[i.test]
                            }
                        })
                    }
            })}
        }
    }


    async toEmbed(config, options)
    {
        let abilities = await this.abilities.awaitDocuments();
        let species = await this.species.document;
        let talents = await this.suggested.talents.awaitDocuments();
        let html = `
        <table>
        <tr class="archetype-header">
            <td colspan="8">
                <p>@UUID[${this.parent.uuid}]{${this.parent.name}}</p>
            </td>
        </tr>
        <tr>
            <td class="archetype-label" colspan="2">
                <p>TIER</p>
            </td>
            <td class="archetype-value">
                <p>${this.tier}</p>
            </td>
            <td class="archetype-label" colspan="2">
                <p>SPECIES</p>
            </td>
            <td class="archetype-value">
                @UUID[${species.uuid}]{${species.name}}
            </td>
            <td class="archetype-label">
                <p>XP Cost</p>
            </td>
            <td class="archetype-value">
                <p>64</p>
            </td>
        </tr>
        <tr>
            <td colspan="8">
                <p><strong>KEYWORDS</strong>: ${this.keywords.map(i => `<a class="keyword">${i.trim()}</a>`).join(", ")}</p>
            </td>
        </tr>
        <tr>
            <td colspan="8" style="background-color:rgba(0, 0, 0, 0.2)">
                <p><strong>ATTRIBUTES</strong>: ${Object.keys(this.attributes).filter(a => this.attributes[a]).map(a => `${game.wng.config.attributes[a]} ${this.attributes[a]}`).join(", ") || "None"}</p>
            </td>
        </tr>
        <tr>
            <td colspan="8">
                <p><strong>SKILLS</strong>: ${Object.keys(this.skills).filter(a => this.skills[a]).map(a => `${game.wng.config.skills[a]} ${this.skills[a]}`).join(", ") || "None"}</p>
            </td>
        </tr>
        <tr>
            <td colspan="8" style="background-color:rgba(0, 0, 0, 0.2)">
                <p><strong>ARCHETYPE ABILITY</strong>: ${abilities.map(i => `@UUID[${i?.uuid}]{${i?.name}}`).join(", ")}</p>
            </td>
        </tr>
        <tr>
            <td colspan="8">
                <p><strong>WARGEAR</strong>: ${this.wargear.textDisplayWithLinks}
        </tr>
        <tr>
            <td colspan="8" style="background-color:rgba(0, 0, 0, 0.2)">
                <p><strong>INFLUENCE</strong>: ${this.influence}</p>
            </td>
        </tr>
        <tr style="height:16px">
            <td class="archetype-header" colspan="8">
                <p><strong>SUGGESTED ATTRIBUTES</strong></p>
            </td>
        </tr>
        <tr style="font-variant:small-caps; text-align: center">
            <td class="archetype-label">
                <p>ATTRITBUTE</p>
            </td>
            <td >
                <p>S</p>
            </td>
            <td style="background-color:rgba(0, 0, 0, .2)">
                <p>T</p>
            </td>
            <td >
                <p>A</p>
            </td>
            <td style="background-color:rgba(0, 0, 0, .2)">
                <p>I</p>
            </td>
            <td >
                <p>Wil</p>
            </td>
            <td style="background-color:rgba(0, 0, 0, 0.2)">
                <p>Int</p>
            </td>
            <td>
                <p>Fel</p>
            </td>
        </tr>
        <tr style="font-variant:small-caps; text-align: center">
            <td class="archetype-label">
                <p>RATING</p>
            </td>
            <td>
                <p>${this.suggested.attributes.strength}</p>
            </td>
            <td style="background-color:rgba(0, 0, 0, .2)">
                <p>${this.suggested.attributes.toughness}</p>
            </td>
            <td>
                <p>${this.suggested.attributes.agility}</p>
            </td>
            <td style="background-color:rgba(0, 0, 0, .2)">
                <p>${this.suggested.attributes.initiative}</p>
            </td>
            <td>
                <p>${this.suggested.attributes.willpower}</p>
            </td>
            <td style="background-color:rgba(0, 0, 0, 0.2)">
                <p>${this.suggested.attributes.intellect}</p>
            </td>
            <td>
                <p>${this.suggested.attributes.fellowship}</p>
            </td>
        </tr>
        <tr>
            <td class="archetype-header" colspan="8">
                <p><strong>SUGGESTED SKILLS</strong></p>
            </td>
        </tr>   
        <tr>
            <td colspan="8">
                <p>${Object.keys(this.suggested.skills).filter(a => this.suggested.skills[a]).map(a => `${game.wng.config.skills[a]} ${this.suggested.skills[a]}`).join(", ")}</p>
            </td>
        </tr>
        `;


        if (talents.length)
        {
            html += `<tr>
            <td class="archetype-header" colspan="8">
                <p><strong>SUGGESTED TALENTS</strong></p>
            </td>
            </tr>   
            <tr>
                <td colspan="8">
                    <p>${talents.map(i => `@UUID[${i.uuid}]{${i.name}}`).join(", ") }</p>
                </td>
            </tr>`
        }

        let div = document.createElement("div");
        div.style = config.style;
        div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(html, {relativeTo : this, async: true, secrets : options.secrets})
        return div;
    }
}

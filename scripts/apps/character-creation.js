import ArchetypeGroups from "./archetype-groups.js";

export default class CharacterCreation extends FormApplication {
    constructor(object) {
        super(object)
        this.actor = object.actor;
        this.archetype = object.archetype;
        this.species = game.wng.utility.findItem(object.archetype.species.id, "species")
        this.faction = game.wng.utility.findItem(object.archetype.faction.id, "faction")
        this.speciesAbilities = this.species.abilities.map(i => game.wng.utility.findItem(i.id, "ability"))
        this.archetypeAbility = game.wng.utility.findItem(this.archetype.ability.id, "ability")
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "character-creation",
            title: "Character Creation",
            template: "systems/wrath-and-glory/template/apps/character-creation.html",
            width: 1000,
            height: 800,
            resizable: true
        })
    }

    async getData() {
        let data = super.getData();
        this.species = await this.species;
        this.faction = await this.faction;
        this.archetypeAbility = await this.archetypeAbility
        this.speciesAbilities = await Promise.all(this.speciesAbilities)

        data.actor = this.actor;
        data.archetype = this.archetype;
        data.species = this.species;
        data.faction = this.faction;
        data.archetypeAbility = this.archetypeAbility
        data.speciesAbilities = this.speciesAbilities
        data.wargearHTML = this.constructWargearHTML();
        console.log(data)
        return data
    }


    async _updateObject(event, formData) {
        this.object.update(formData)
    }

    constructWargearHTML() {
        let html = ""


        let groupToHTML = (group, { selector = false } = {}) => {
            let html = ""
            if (["and", "or"].includes(group.type)) {
                let connector = `<span class="connector">${group.type}</span>`
                html += `<div class='wargear-group ${group.type == "or" ? "choice" : ""} ${group.groupId == "root" ? "root" : ""}' data-id="${group.groupId}">`
                html += group.items.map(g => {
                    let groupHTML = groupToHTML(g)
                    if (group.type == "or") {
                        groupHTML = `<div class="wargear-selection" data-id="${g.groupId}">${groupHTML}<a class="wargear-selector"><i class="far fa-circle"></i></a></div>`
                    }
                    return groupHTML
                }).join(group.groupId == "root" ? "" : connector)
                html += "</div>"
                return html
            }
            else if (group.type == "item") {
                return `<div class="wargear-item" data-id='${group.groupId}'>${group.name}</div>`
            }
            else if (group.type == "generic") {
                return `<div class="wargear-item generic" data-id='${group.groupId}'><i class="fas fa-filter"></i> ${group.name}</div>`
            }
        }

        html += groupToHTML(ArchetypeGroups.groupIndexToObjects(this.archetype.groups, this.archetype), html)
        return html;
    }

    activateListeners(html) {
        super.activateListeners(html);


        html.find(".wargear-selector").click(ev => {

            if (this.isDisabled(ev.currentTarget))
                return

                
                let parent = $(ev.currentTarget).closest(".wargear-selection");
                let group = parent.find(".wargear-group,.wargear-item")
                let groupId = group.attr("data-id")
                let choice = parent.closest(".choice")

            // Cannot uncheck that which has checked descendents ( >1 to exclude self, kinda gross but whatever)
            if (!this.isDisabled(ev.currentTarget) && parent.find(".on").length > 1)
                return
                
            let isChecked = this.toggleSelector(ev.currentTarget);

            if (isChecked)
            {
                // Select all ancestors
                parent.parents(".wargear-selection").each((i, e) => {
                    $(e).children(".wargear-selector").each((j, selector) => {
                        this.setSelector(selector, "on")
                    })
                })

                // Disable siblings
                choice.children().each((i, e) => {
                    if (e.dataset.id != groupId) {
                        this.disableElements(e)
                    }
                })
            }
            else // If unchecked
            {
                choice.find(".disabled").each((i, e) => {
                    this.enableElements(e)
                })
            }

        })
    }


    _toggleGroupIcon(element, force) {
        $(element).find(".wargear-selector").each((i, el) => {
            this._toggleFAIcon($(el).children()[0], force)
        })
    }


    disableElements(element) 
    {
        element.classList.add("disabled")
        $(element).find(".wargear-selector").each((i, el) => {
            this.setSelector(el, "off")
        })
    }

    enableElements(element)
    {
        element.classList.remove("disabled")
    }

    toggleSelector(element)
    {
        if (this.isOn(element))
            return this.setSelector(element, "off")
        else if(!this.isOn(element))
            return this.setSelector(element, "on")
    }

    setSelector(element, value)
    {
        if (value == "on")
        {
            element.classList.add(value)
            element.classList.remove("off")
            
        }
        else if (value == "off")
        {
            element.classList.add(value)
            element.classList.remove("on")
        }

        this._setFAIcon(element, value)

        return value == "on" // return true if on, otherwise false
    }

    isOn(element)
    {
        return element.classList.contains("on")
    }

    isDisabled(element)
    {
        return $(element).parents(".disabled").length
    }

    _setFAIcon(element, value)
    {
        let fa = element.children[0];
        if (value == "on")
        {
            fa.classList.remove("fa-circle")
            fa.classList.add("fa-check-circle")
        }
        else if (value == "off")
        {
            fa.classList.remove("fa-check-circle")
            fa.classList.add("fa-circle")
        }
    }
}
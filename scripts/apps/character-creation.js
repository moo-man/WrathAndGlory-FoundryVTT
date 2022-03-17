import { WrathAndGloryItem } from "../item/item.js";
import ArchetypeGroups from "./archetype-groups.js";
import FilterResults from "./filter-results.js";

export default class CharacterCreation extends FormApplication {
    constructor(object) {
        super(object)
        this.actor = object.actor;
        this.archetype = object.archetype.clone();
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
            width: 1400,
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

    /**
     * Replace a filter html with an item
     * 
     * @param {Object} filter Filter details (to replace with object)
     * @param {String} id ID of item chosen
     */
    chooseWargear(filter, id)
    {
        let element = this.element.find(`.generic[data-id=${filter.groupId}]`)[0]
        let group = ArchetypeGroups.search(filter.groupId, this.archetype.groups)
        let wargearObject = this.archetype.wargear[group.index]
        let item = game.items.get(id)
        
        if (element && item) 
        {
            element.classList.remove("generic")
            element.textContent = item.name

            wargearObject.type = "item"
            wargearObject.name = item.name;
            wargearObject.id = item.id;
        }
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

        html.find(".wargear-item").click(async ev => {
            let id = ev.currentTarget.dataset.id
            let group = ArchetypeGroups.search(id, this.archetype.groups)
            let wargear = this.archetype.wargear[group.index]

            if (wargear.type == "generic")
            {
                new FilterResults({wargear, app: this}).render(true)
            }
            else
              new WrathAndGloryItem(game.items.get(wargear.id).toObject()).sheet.render(true, {editable: false})
        })


        html.find(".background").click(ev => {
            // let parent = $(ev.currentTarget).parents("ol");
            // parent.find(".active").each((i, e) => {
            //     e.classList.remove("active")
            // })
            // ev.currentTarget.classList.add("active")

            // this.resetBonus()

            this.chooseBackground(ev.currentTarget)
        })

        html.find(".roll-background").click(ev => {
            let background = ev.currentTarget.classList[1];
            let list = this.faction.backgrounds[background]
            let random = Math.floor(CONFIG.Dice.randomUniform() * list.length);
            let chosen = this.element.find(`.${background} .background[data-index="${random}"]`)
            this.chooseBackground(chosen[0])
        })
    }

    /**
     * Takes a background element that's part of a background list, clears other active (can only choose 1), and adds active to the element passed into it
     * Finally it calls resetBonus to update the select element that contains all the background bonuses selected
     * 
     * @param {HTMLElement} element HTML background element
     */
    chooseBackground(element)
    {

        let parent = $(element).parents("ol");
        parent.find(".active").each((i, e) => {
            e.classList.remove("active")
        })
        element.classList.add("active")

        this.resetBonus()

    }


    /**
     * The selector should only include bonuses from selected backgrounds. This returns a string for html representing the available bonuses
     * based on what backgrounds have the active class
     * 
     * @returns html representing the select's available options
     */
    getAvailableBonuses()
    {
        let ids = []
        this.element.find(".background.active").each((i, e) => {
            ids.push(e.dataset.effect)
        })
        let effects = ids.map(id => this.faction.effects.get(id))
        let html = "<option value=''>-</option>"

        effects.forEach(e => {
            html += `<option value=${e.id}>${e.data.label}</option>`
        })
        return html
    }

    /**
     * Each time backgrounds are updated, the available bonuses must be updated to only include
     * effects from the selected backgrounds
     */
    resetBonus() {
        let select = this.element.find(".background-bonus")
        select[0].value = "";
        select.children().remove()
        select.append(this.getAvailableBonuses())
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
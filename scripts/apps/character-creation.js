import WNGUtility from "../common/utility.js";
import { WrathAndGloryItem } from "../document/item.js";
import ArchetypeGroups from "./archetype-groups.js";
import FilterResults from "./filter-results.js";

export default class CharacterCreation extends FormApplication {
    constructor(object) {
        super(object)
        this.actor = object.actor;
        this.archetype = object.archetype.clone();
        this.species = game.wng.utility.findItem(object.archetype.species.id, "species")
        this.faction = game.wng.utility.findItem(object.archetype.faction.id, "faction")
        this.speciesAbilities = []; // Must be awaited if species is a promise
        this.archetypeAbility = game.wng.utility.findItem(this.archetype.ability.id, "ability")
        this.addedTalents = [];
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "character-creation",
            title: "Character Creation",
            template: "systems/wrath-and-glory/template/apps/character-creation.hbs",
            width: 1400,
            closeOnSubmit: false,
            height: 800,
            resizable: true,
            dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null}]
    })
    }


    initializeCharacter()
    {
        this.character = new CONFIG.Actor.implementation({type: "agent", name : this.object.actor.name}) // Temporary actor 

        // Can't just merge object because actor attributes/skills are an object, archetype and species have just numbers
        for (let attribute in this.character.attributes)
        {
            if (this.species.attributes[attribute])
                this.character.updateSource({[`system.attributes.${attribute}.base`] : this.species.attributes[attribute]})
            if (this.archetype.attributes[attribute])
                this.character.updateSource({[`system.attributes.${attribute}.base`] : this.archetype.attributes[attribute]})
        }
        for (let skill in this.character.skills)
        {
            if (this.species.skills[skill])
            this.character.updateSource({[`system.skills.${skill}.base`] : this.species.skills[skill]})
            if (this.archetype.skills[skill])
                this.character.updateSource({[`system.skills.${skill}.base`] : this.archetype.skills[skill]})
        }

        this.character.updateSource({"system.experience.total" : this.archetype.tier * 100, "system.advances.species" : this.archetype.cost})
        
        this.character.prepareData();

        // Allows us to prevent user from going below base stats
        this.baseCharacter = this.character.toObject(false) 
    }

    async getData() {
        let data = super.getData();
        this.species = await this.species;
        this.faction = await this.faction;
        this.archetypeAbility = await this.archetypeAbility
        this.speciesAbilities = await Promise.all(this.species.abilities.map(i => game.wng.utility.findItem(i.id, "ability")))

        this.initializeCharacter()

        data.actor = this.actor;
        data.character = this.character
        data.archetype = this.archetype;
        data.species = this.species;
        data.faction = this.faction;
        data.archetypeAbility = this.archetypeAbility
        data.speciesAbilities = this.speciesAbilities
        data.wargearHTML = this.constructWargearHTML();
        return data
    }


   async _onDrop(ev) {
    let data = JSON.parse(ev.dataTransfer.getData("text/plain"));
    let dropItem = await Item.implementation.fromDropData(data);
    if (dropItem.type == "talent")
    {
        this.addTalent(dropItem)
    }
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
            else if (group.type == "item" || (group.type == "generic" && group.filters.length == 0)) {
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
    async chooseWargear(filter, id)
    {
        let element = this.element.find(`.generic[data-id=${filter.groupId}]`)[0]
        let group = ArchetypeGroups.search(filter.groupId, this.archetype.groups)
        let wargearObject = this.archetype.wargear[group.index]
        let item = await game.wng.utility.findItem(id)
        
        if (element && item) 
        {
            element.classList.remove("generic")
            element.textContent = item.name

            wargearObject.type = "item"
            wargearObject.name = item.name;
            wargearObject.id = item.id;
        }
    }

    async _updateObject(ev, formData) {

        let proceed = await this.validateForm(formData)
        if (!proceed) {
            return
        }

        this.character.updateSource({ "prototypeToken": this.actor.prototypeToken })

        this.character.updateSource({"system.combat.speed" : this.species.speed, "system.combat.size" : this.species.size})
        this.character.updateSource({"system.resources.influence" : this.archetype.influence});
        this.character.updateSource({"system.advances.tier" : this.archetype.tier});
        this.character.updateSource({
            "img": this.actor.img,
            "name": formData.name,
            "token.name": formData.name
        })

        let faction = this.faction?.toObject()
        if (faction)
        {
            if (formData["background-bonus"])
            {
                faction.effects = faction.effects.filter(e => e._id == formData["background-bonus"])
                
                if (faction.effects[0].changes[0].mode == 0)
                {
                    let key = faction.effects[0].changes[0].key
                    // Some faction effects specify custom mode, specifically for wealth and influence, this should be a one time change instead of an effect
                    this.character.updateSource({[key] : getProperty(this.character.data, key) + 1})
                    faction.effects = [];
                }
                else 
                {
                    faction.effects[0].transfer = true;
                    faction.effects[0].name = $(ev.target).find(".background-bonus").children("option").filter(":selected").text()
                    // Gross but whatever, uses the selected text (with background name appended) as the effect name
                }
            }

            // Set chosen backgrounds to active
            let chosenOrigin = $(this.form).find(".origin .active")[0]
            let chosenAccomplishment = $(this.form).find(".accomplishment .active")[0]
            let chosenGoal = $(this.form).find(".goal .active")[0]

            if(chosenOrigin) {
                faction.system.backgrounds.origin[chosenOrigin.dataset.index || 0].active = true;
            }
            if(chosenAccomplishment) {
                faction.system.backgrounds.accomplishment[chosenAccomplishment.dataset.index || 0].active = true;
            }
            if(chosenGoal) {
                faction.system.backgrounds.goal[chosenGoal.dataset.index || 0].active = true;
            }
        }
        else
        {
            ui.notifications.warn("Faction could not be found. Skipping Faction bonuses")
        }


        let wargear = await Promise.all(this.retrieveChosenWargear());
        let items = [
            this.archetype?.toObject(), 
            this.species?.toObject(), 
            faction,
            this.archetypeAbility?.toObject()]
            .concat(wargear.filter(i => i).map(e => e?.toObject()))
            .concat(this.speciesAbilities.map(a=> a?.toObject()))
            .concat(this.addedTalents)
            .concat((await Promise.all(this.archetype.keywords.map(WNGUtility.getKeywordItem))).map(i => i?.toObject())).filter(i => i)


        await this.actor.update(mergeObject(this.character.toObject(), { overwrite: true }))
        this.actor.createEmbeddedDocuments("Item", items) // Separately add items so effects are inherently added
        this.close();
    }

    validateForm(formData) {
        return new Promise((resolve) => {
            // SKILLS
            let errors = [];

            if (parseInt(this.element.find(".xp input")[0].value) > parseInt(this.element.find(".xp input")[1].value))
            {
                errors.push("Spent XP exceeds Available XP")
            }

            if (!formData["background-bonus"])
            {
                errors.push("Background bonus not selected")
            }

            let unresolvedGenerics = false;
            // WARGEAR
            this.element.find(".wargear-item.generic").each((i, e) => {
                if (!this.isDisabled(e)) {
                    let id = e.dataset.id
                    let group = ArchetypeGroups.search(id, this.archetype.groups)
                    let wargear = this.archetype.wargear[group.index]
                    if (wargear.filters.length)
                        unresolvedGenerics = true;
                }
            })
            if (unresolvedGenerics)
                errors.push("Unresolved Generic Items")


            if (errors.length) {
                new Dialog({
                    label: "Errors",
                    content: `<p>The following errors have been detected.</p>
                  <ul>
                  <li>${errors.join("</li><li>")}</li>
                  </ul>
                  <p>Proceed anyway?</p>
                  `,
                    buttons: {
                        confirm: {
                            label: "Confirm",
                            callback: () => {
                                resolve(true)
                            }
                        },
                        cancel: {
                            label: "Cancel",
                            callback: () => {
                                resolve(false)
                            }
                        }
                    },
                    close : () => resolve(false),
                    render : (html) => {
                        html.parents(".dialog").find("header a").remove()
                    }
                }).render(true)
            }
            else resolve(true)
        })
    }

    
    // Take the wargear of the archetype, check if it has the disabled class in the form (if it was not chosen), create a temporary item
    retrieveChosenWargear() {
        let wargear = this.archetype.wargear;
        // Filter wargear by whether it has a disabled ancestor, if not, add to actor
        return wargear.filter(e => {
            let element = this.element.find(`.wargear-item[data-id='${e.groupId}']`)
            let enabled = element.parents(".disabled").length == 0
            return enabled
        }).map(async e => {
            let item;
            // If chosen item is still generic, create a basic item for it
            if (e.type == "generic") {
                item = new WrathAndGloryItem({ type: "gear", name: e.name, img: "modules/wng-core/assets/icons/gear/gear.webp" })
            }
            else if (e.id) {
                // Create a temp item and incorporate the diff
                let document = await game.wng.utility.findItem(e.id)
                if (document)
                    item = new WrathAndGloryItem(mergeObject(document.toObject(), e.diff, { overwrite: true }))
                else if (e.name)
                {
                    ui.notifications.warn(`Could not find ${e.name}, creating generic`)
                    item = new WrathAndGloryItem({ type: "gear", name: e.name, img: "modules/wng-core/assets/icons/gear/gear.webp" })
                }
            }
            return item
        }).filter(i => i);
    }

    activateListeners(html) {
        super.activateListeners(html);


        html.find(".wargear-selector").click(ev => {

            if (this.isDisabled(ev.currentTarget))
                return

            let parent = $(ev.currentTarget).closest(".wargear-selection");
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
                        this.disableSiblingChoices(selector)
                    })
                })

                // Disable siblings
                this.disableSiblingChoices(ev.currentTarget)
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

            if (wargear.type == "generic" && wargear.filters.length)
            {
                new FilterResults({wargear, app: this}).render(true)
            }
            else if (wargear.type == "item")
              new WrathAndGloryItem((await game.wng.utility.findItem(wargear.id)).toObject()).sheet.render(true, {editable: false})
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
        
        
        html.find(".stat-edit button").mouseup(ev => {
            let parent = $(ev.currentTarget).parents(".stat-edit")
            let target = parent.attr("data-attribute") ? "attributes" : "skills"
            let stat
            if (target == "attributes")
                stat = parent.attr("data-attribute")
            else 
                stat = parent.attr("data-skill")
            
            let statObj = duplicate(getProperty(this.character, `${target}.${stat}`))

            if (ev.target.classList.contains("inc"))
            {
                statObj.rating++;
                statObj.total++;
            }
            else if (ev.target.classList.contains("dec"))
            {
                statObj.rating--;
                statObj.total--;
            }

            // Can't go to 0 or base character, and can't go above species max
            if (statObj.total <= 0 || statObj.total < getProperty(this.baseCharacter, `system.${target}.${stat}.total`) || (target == "attributes" && (statObj.total > getProperty(this.species, `attributeMax.${stat}`))))
                return;

            this.character.updateSource({[`system.${target}.${stat}.rating`] : statObj.rating})

            this.updateDerived();
        })

        html.on("click", ".talent-delete", ev => {
            let parent = $(ev.currentTarget).parents(".ability")
            let index = parseInt(parent.attr("data-index"));
            parent.remove();
            this.addedTalents.splice(index, 1);
            if (this.addedTalents.length == 0)
            {
                this.element.find(".talents h4").remove()
            }
            this.updateDerived();
        })
    }

    updateDerived() {
        this.updateStats()
        this.updateExperience()
    }

    updateStats() {
        let stats = this.element.find(".stat-edit");
        let attributes = Array.from(stats.filter((i, e) => e.dataset.attribute))
        let skills = Array.from(stats.filter((i, e) => e.dataset.skill))

        attributes.forEach(element => {
            let input = $(element).find("input")[0]
            input.value = this.character.system.attributes[element.dataset.attribute].total
        })

        skills.forEach(element => {
            let input = $(element).find("input")[0]
            input.value = this.character.system.skills[element.dataset.skill].total
        })
    }

    updateExperience()
    {
        let talentXP = this.addedTalents.reduce((prev, current) => prev + current.system.cost, 0)
        this.element.find(".xp input")[0].value = this.character.experience.spent + talentXP + this.archetype.cost;
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


    async addTalent(talent)
    {
        let list = this.element.find(".talents")
        if (this.addedTalents.length == 0)
        {
            list.append(`<h4>Talents</h4>`)
        }
        this.addedTalents.push(talent.toObject());
        this.updateDerived();

        let html = `
        <div class="ability data-index='${this.addedTalents.length-1}'">
        <div class="ability-header">
            <img src="${talent.img}">
            <label>${talent.name}</label>
            <a class="talent-delete"><i class="fas fa-times"></i></a>
        </div>
        <div class="ability-description">
            ${await TextEditor.enrichHTML(talent.description, {async: true})}
        </div>
        </div>`

        list.append(html)
    }


    /**
     * The selector should only include bonuses from selected backgrounds. This returns a string for html representing the available bonuses
     * based on what backgrounds have the active class
     * 
     * @returns html representing the select's available options
     */
    getAvailableBonuses()
    {
        let backgroundsChosen = []
        this.element.find(".background.active").each((i, e) => {
            backgroundsChosen.push({id : e.dataset.effect, index : e.dataset.index, type : $(e).parents("ol")[0].classList.value})
        })
        backgroundsChosen.forEach(bg => {
            bg.effect = this.faction.effects.get(bg.id)
        })
        let html = "<option value=''>-</option>"

        backgroundsChosen.forEach(bg => {
            html += `<option value=${bg.id}>${bg.effect.name} (${this.faction.backgrounds[bg.type][bg.index]?.name})</option>`
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



    //#region Wargear 


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

    disableSiblingChoices(element)
    {
        let parent = $(element).closest(".wargear-selection");
        let group = parent.find(".wargear-group,.wargear-item")
        let groupId = group.attr("data-id")
        let choice = parent.closest(".choice")
        
        // Disable siblings
        choice.children().each((i, e) => {
            if (e.dataset.id != groupId) {
                this.disableElements(e)
            }
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
    //#endregion
}
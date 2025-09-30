import WNGUtility from "../common/utility.js";
import { WrathAndGloryItem } from "../document/item.js";

export default class CharacterCreation extends FormApplication {
    constructor(object) {
        super(object)
        this.actor = object.actor;
        this.archetype = object.archetype.clone();
        this.species = object.archetype.species.document;
        this.faction = object.archetype.faction.document;
        this.archetypeAbilities = object.archetype.system.abilities.documents;
        this.speciesAbilities = []; // Must be awaited if species is a promise
        this.wargear = this.archetype.system.wargear.clone();
        this.addedTalents = [];
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "character-creation",
            title: "Character Creation",
            template: "systems/wrath-and-glory/templates/apps/character-creation.hbs",
            width: 1400,
            closeOnSubmit: false,
            height: 800,
            resizable: true,
            dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null}]
    })
    }


    async initializeCharacter()
    {
        this.character = new Actor.implementation({type: "agent", name : this.object.actor.name, system: foundry.utils.deepClone(game.system.template.Actor.agent)})

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
        if (!this.species)
        {
            ui.notifications.error("Archetypes must assign a Species Item");
            throw "Archetypes must assign a Species Item";
        }
        if (!this.faction)
        {
            ui.notifications.error("Archetypes must assign a Faction Item");
            throw "Archetypes must assign a Faction Item";
        }
        this.archetypeAbilities = await this.archetype?.system.abilities.awaitDocuments() || [];
        this.speciesAbilities = await this.species?.system.abilities.awaitDocuments() || []

        await this.initializeCharacter()

        data.actor = this.actor;
        data.character = this.character
        data.archetype = this.archetype;
        data.species = this.species;
        data.faction = this.faction;
        data.archetypeAbilities = this.archetypeAbilities
        data.speciesAbilities = this.speciesAbilities
        data.enrichment = await this._handleEnrichment(data)
        data.wargearHTML = this.constructWargearHTML();
        return data
    }

    async _handleEnrichment(data)
    {   
        let enrichment = {};

        for(let ability of this.archetypeAbilities)
        {
            enrichment[ability.id] = await foundry.applications.ux.TextEditor.enrichHTML(ability.system.description);
        }
        for(let ability of data.speciesAbilities)
        {
            enrichment[ability.id] = await foundry.applications.ux.TextEditor.enrichHTML(ability.system.description);
        }
        return enrichment
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
                html += `<div class='wargear-group ${group.type == "or" ? "choice" : ""} ${group.id == "root" ? "root" : ""}' data-id="${group.id}">`
                html += group.options.map(g => {
                    let groupHTML = groupToHTML(g)
                    if (group.type == "or") {
                        groupHTML = `<div class="wargear-selection" data-id="${g.id}">${groupHTML}<a class="wargear-selector"><i class="far fa-circle"></i></a></div>`
                    }
                    return groupHTML
                }).join(group.id == "root" ? "" : connector)
                html += "</div>"
                return html
            }
            else {
                if (group.content.type == "filter") {
                    return `<div class="wargear-item placeholder" data-id='${group.id}'><i class="fas fa-filter"></i> ${group.content.name}</div>`
                }
                else 
                {
                    return `<div class="wargear-item" data-id='${group.id}'>${group.content.name}</div>`
                }
            }
        }

        html += groupToHTML(this.wargear.compileTree().structure)
        return html;
    }

    /**
     * Replace a filter html with an item
     * 
     * @param {Object} filter Filter details (to replace with object)
     * @param {String} id ID of item chosen
     */
    async chooseWargear(option, document)
    {
        let element = this.element.find(`.placeholder[data-id=${option.id}]`)[0]

        if (element && document) 
        {
            element.classList.remove("placeholder")
            element.textContent = document.name

            option.type = "item";
            option.name = document.name;
            option.documentId = document.id;
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
            let effectId = formData["background-bonus"];
            if (formData["background-bonus"])
            {
                let effect = faction.effects.find(i => i._id == effectId)
                if (effect.changes[0].mode == 0)
                {
                    let key = effect.changes[0].key
                    // Some faction effects specify custom mode, specifically for wealth and influence, this should be a one time change instead of an effect
                    this.character.updateSource({[key] : foundry.utils.getProperty(this.character, key) + 1})
                }
                else 
                {
                    // faction.effects[0].transfer = true;
                    effect.name = $(ev.target).find(".background-bonus").children("option").filter(":selected").text()
                    // Gross but whatever, uses the selected text (with background name appended) as the effect name
                }
            }

            // Set chosen backgrounds to active
            let chosenOrigin = $(this.form).find(".origin .active")[0]
            let chosenAccomplishment = $(this.form).find(".accomplishment .active")[0]
            let chosenGoal = $(this.form).find(".goal .active")[0]

            if(chosenOrigin) {
                let bg = faction.system.backgrounds.origin[chosenOrigin.dataset.index || 0]
                bg.active = true;
                bg.chosen = effectId == bg.effect.id;
                this.character.updateSource({"system.bio.origin" : bg.description});
            }
            if(chosenAccomplishment) {
                let bg = faction.system.backgrounds.accomplishment[chosenAccomplishment.dataset.index || 0]
                bg.active = true;
                bg.chosen = effectId == bg.effect.id;
                this.character.updateSource({"system.bio.accomplishment" : bg.description});
            }
            if(chosenGoal) {
                let bg = faction.system.backgrounds.goal[chosenGoal.dataset.index || 0]
                bg.active = true;
                bg.chosen = effectId == bg.effect.id;
                this.character.updateSource({"system.bio.goal" : bg.description});
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
            faction]
            .concat(this.archetypeAbilities.map(i => i?.toObject()).filter(i => i))
            .concat(wargear.filter(i => i).map(e => e?.toObject()))
            .concat(this.speciesAbilities.map(a=> a?.toObject()))
            .concat(this.addedTalents)
            .concat((await Promise.all(this.archetype.keywords.map(WNGUtility.getKeywordItem))).map(i => i?.toObject())).filter(i => i)

        let characterData = this.character.toObject();
        delete characterData.folder;

        await this.actor.update(characterData);
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

            let unresolvedplaceholders = false;
            // WARGEAR
            this.element.find(".wargear-item.placeholder").each((i, e) => {
                if (!this.isDisabled(e)) {
                    let id = e.dataset.id
                    let option = this.wargear.options.find(i => i.id == id);
                    if (option.type == "filter" && option.filters.length)
                    {
                        unresolvedplaceholders = true;
                    }
                }
            })
            if (unresolvedplaceholders)
                errors.push("Unresolved placeholder Items")


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
        // Filter wargear by whether it has a disabled ancestor, if not, add to actor
        return this.archetype.wargear.options.filter(e => {
            let element = this.element.find(`.wargear-item[data-id='${e.id}']`)
            let enabled = element.parents(".disabled").length == 0
            return enabled
        }).map(async e => {
            let item = await this.wargear.getOptionDocument(e.id)
            if (!["filter", "placeholder"].includes(e.type))
            {
                return item;
            }
            else 
            {
                return new Item.implementation(item)
            }
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
            let option = this.wargear.options.find(i => i.id == id);

            if (option.type == "filter")
            {
                let document = await this.wargear.getOptionDocument(id)
                if (document instanceof Item)
                {
                    this.chooseWargear(option, document);
                }
                else 
                {
                    ui.notifications.error("Either no results found or no result was selected.")
                }
            }
            else
            {
                let document = await this.wargear.getOptionDocument(id)
                document.sheet.render(true, {editable : false});
            }
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
            
            let statObj = foundry.utils.getProperty(this.character.toObject(false), `system.${target}.${stat}`)

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
            if (statObj.total <= 0 || statObj.total < foundry.utils.getProperty(this.baseCharacter, `system.${target}.${stat}.total`) || (target == "attributes" && (statObj.total > foundry.utils.getProperty(this.species, `attributeMax.${stat}`))))
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
            ${await foundry.applications.ux.TextEditor.enrichHTML(talent.description, {async: true})}
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
        let id = group.attr("data-id")
        let choice = parent.closest(".choice")
        
        // Disable siblings
        choice.children().each((i, e) => {
            if (e.dataset.id != id) {
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
import ActorConfigure from "../../apps/actor-configure.js";

export class BaseWnGActorSheet extends ActorSheet {
    rollData = {};

    static get defaultOptions() {
        let options = super.defaultOptions;
        options.classes = options.classes.concat(["wrath-and-glory", "actor"])
        options.width = 720,
        options.height = 800,
        options.resizable = true,
        options.tabs = [{navSelector: ".sheet-tabs",contentSelector: ".sheet-body",initial: "main",},],
        options.scrollY = [".sheet-body"]
        return options;
    }

    get template() {
        return `systems/wrath-and-glory/template/actor/${this.actor.type}.hbs`
    }

    async getData() {
        const sheetData = await super.getData();
        sheetData.enrichment = {};
        sheetData.system = sheetData.data.system // project system data so that handlebars has the same name and value paths
        this.constructEffectLists(sheetData)

        sheetData.enrichment = await this._handleEnrichment()
        
        return sheetData;
    }

    async _handleEnrichment()
    {
        let enrichment = {}
        enrichment["system.notes"] = await TextEditor.enrichHTML(this.actor.system.notes, {async: true})

        return expandObject(enrichment)
    }

    _getSubmitData(updateData = {}) {
        this.actor.overrides = {}
        let data = super._getSubmitData(updateData);
        data = diffObject(flattenObject(this.actor.toObject(false)), data)
        return data
    }

    constructEffectLists(sheetData) {
        let effects = {}

        effects.conditions = CONFIG.statusEffects.map(i => {
            return {
                label: i.label,
                key: i.id,
                img: i.icon,
                existing: this.actor.hasCondition(i.id)
            }
        })
        effects.temporary = sheetData.actor.effects.filter(i => i.isTemporary && !i.disabled && !i.isCondition)
        effects.disabled = sheetData.actor.effects.filter(i => i.disabled && !i.isCondition)
        effects.passive = sheetData.actor.effects.filter(i => !i.isTemporary && !i.disabled && !i.isCondition)

        sheetData.effects = effects;
    }


    activateListeners(html) {
        super.activateListeners(html);
        html.find("select").click(ev => ev.stopPropagation())
        html.find(".item-dropdown").mousedown(this._dropdownLeftClick.bind(this))
        html.find(".rollable").mouseenter(this._toggleDice.bind(this))
        html.find(".rollable").mouseleave(this._toggleDice.bind(this))
        html.find(".rollable").mousedown(this._onRollableAbilityClick.bind(this))
        html.find(".item-dropdown-right").mousedown(this._dropdownRightClick.bind(this))
        html.find(".item-create").mousedown(this._onItemCreate.bind(this));
        html.find(".item-edit").click(this._onItemEdit.bind(this));
        html.find(".item-delete").mousedown(this._onItemDelete.bind(this));
        html.find(".item-post").mousedown(this._onItemPost.bind(this));
        html.find(".effect-create").click(this._onEffectCreate.bind(this));
        html.find(".effect-edit").click(this._onEffectEdit.bind(this));
        html.find(".effect-delete").click(this._onEffectDelete.bind(this));
        html.find(".effect-toggle").click(this._onEffectToggle.bind(this));
        html.find("input").focusin(this._onFocusIn.bind(this));
        html.find(".checkbox").click(this._onCheckboxClick.bind(this))
        html.find(".property-edit").change(this._onSelectChange.bind(this))
        html.find(".qty-click").click(this._onQuantityClick.bind(this))
        html.find(".condition-toggle").click(this._onConditionToggle.bind(this))
        html.find(".condition-click").mousedown(this._onConditionClick.bind(this));
        html.find(".item-trait").mousedown(this._onItemTraitClick.bind(this))

        html.find(".items .item").each((i, e) => {
            e.draggable = true;
        })
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        if (this.actor.isOwner) {
            buttons = [
                {
                    label: "BUTTON.CONFIGURE",
                    class: "actor-configure",
                    icon: "fas fa-wrench",
                    onclick: (ev) => new ActorConfigure(this.actor).render(true)
                }
            ].concat(buttons);
        }
        return buttons;
    }

    _onItemCreate(event) {
        event.stopPropagation();
        let header = event.currentTarget.dataset

        let data = {
            name: `New ${game.i18n.localize("ITEM.Type" + header.type.toLowerCase().capitalize())}`,
            type: header.type
        };
        this.actor.createEmbeddedDocuments("Item", [data], { renderSheet: true });
    }

    _onItemEdit(event) {
        event.stopPropagation();
        const div = $(event.currentTarget).parents(".item");
        const item = this.actor.items.get(div.data("itemId"));
        item.sheet.render(true);
    }

    _onItemDelete(event) {
        event.stopPropagation();
        const div = $(event.currentTarget).parents(".item");
        new Dialog({
            title: game.i18n.localize("DIALOG.ITEM_DELETE"),
            content: `<p>${game.i18n.localize("DIALOG.ITEM_DELETE_PROMPT")}`,
            buttons: {
                "yes": {
                    label: game.i18n.localize("Yes"),
                    callback: () => {
                        this.actor.deleteEmbeddedDocuments("Item", [div.data("itemId")]);
                        div.slideUp(200, () => this.render(false));
                    }
                },
                "cancel": {
                    label: game.i18n.localize("Cancel"),
                    callback: () => { }
                }
            },
            default: "yes"
        }).render(true)
    }

    _onItemPost(event) {
        event.stopPropagation();
        const id = $(event.currentTarget).parents(".item").attr("data-item-id");
        let item = this.actor.items.get(id);
        if (item)
            item.sendToChat()
    }


    async _onEffectCreate(ev) {
        let type = ev.currentTarget.attributes["data-type"].value
        let effectData = { label: "New Effect", icon: "icons/svg/aura.svg" }
        if (type == "temporary") {
            effectData["duration.rounds"] = 1;
        }

        let html = await renderTemplate("systems/wrath-and-glory/template/apps/quick-effect.hbs")
        let dialog = new Dialog({
            title: "Quick Effect",
            content: html,
            buttons: {
                "create": {
                    label: "Create",
                    callback: html => {
                        let mode = 2
                        let label = html.find(".label").val()
                        let key = html.find(".key").val()
                        let value = parseInt(html.find(".modifier").val())
                        effectData.label = label
                        effectData.changes = [{ key, mode, value }]
                        this.actor.createEmbeddedDocuments("ActiveEffect", [effectData])
                    }
                },
                "skip": {
                    label: "Skip",
                    callback: () => this.actor.createEmbeddedDocuments("ActiveEffect", [effectData]).then(effect => effect[0].sheet.render(true))
                }
            }
        })
        await dialog._render(true)
        dialog._element.find(".label").select()


    }

    _onEffectEdit(ev) {
        let id = $(ev.currentTarget).parents(".item").attr("data-effect-id")
        this.object.effects.get(id).sheet.render(true)
    }

    _onEffectDelete(ev) {
        let id = $(ev.currentTarget).parents(".item").attr("data-effect-id")
        this.object.deleteEmbeddedDocuments("ActiveEffect", [id])
    }

    _onEffectToggle(ev) {
        let id = $(ev.currentTarget).parents(".item").attr("data-effect-id")
        let effect = this.object.effects.get(id)

        effect.update({ "disabled": !effect.disabled })
    }

    _onFocusIn(event) {
        $(event.currentTarget).select();
    }

    async _onRollableAbilityClick(ev) {
        const div = $(event.currentTarget).parents(".item");
        const item = this.actor.items.get(div.data("itemId"));

        if (ev.button == 0) {
            let test
            if (item.abilityType == "determination")
                test = await this.actor.setupGenericTest("determination")
            else
                test = await this.actor.setupAbilityRoll(item)

            await test.rollTest();
            test.sendToChat()
        }
        else
            this._dropdownRightClick(ev)
    }

    _toggleDice(ev) {
        let li = $(ev.currentTarget).parents(".item")

        let img = li.find("img")[0]

        if (img.style.display == "none") {
            img.style.display = "flex";
            Array.from(li.find(".dice")).forEach(d => d.remove())
        }
        else {
            $(img).after("<div class='dice'><i class='fas fa-dice'></i></div>")
            img.style.display = "none"
        }
    }

    _onConditionToggle(event) {
        let key = $(event.currentTarget).parents(".condition").attr("data-key")
        if (this.actor.hasCondition(key))
            this.actor.removeCondition(key)
        else
            this.actor.addCondition(key)
    }

    _onCheckboxClick(event) {
        let target = $(event.currentTarget).attr("data-target")
        if (target == "item") {
            target = $(event.currentTarget).attr("data-item-target")
            let item = this.actor.items.get($(event.currentTarget).parents(".item").attr("data-item-id"))
            return item.update({ [`${target}`]: !getProperty(item.data, target) })
        }
        if (target)
            return this.actor.update({ [`${target}`]: !getProperty(this.actor.data, target) });
    }

    _onSelectChange(event) {
        let target = $(event.currentTarget).attr("data-target")
        let id = $(event.currentTarget).parents(".item").attr("data-item-id")
        let item = this.actor.items.get(id)
        return item.update({ [target]: event.target.value })
    }

    _onQuantityClick(event) {
        event.stopPropagation()
        let id = $(event.currentTarget).parents(".item").attr("data-item-id")
        let item = this.actor.items.get(id)
        let multiplier
        if (event.currentTarget.dataset.type == "increment")
            multiplier = 1
        else if (event.currentTarget.dataset.type == "decrement")
            multiplier = -1
        else
            multiplier = event.button == 0 ? 1 : -1

        multiplier = event.ctrlKey ? multiplier * 10 : multiplier
        item.update({ "data.quantity": item.quantity + 1 * multiplier })
    }

    _dropdownRightClick(event) {
        let id = $(event.currentTarget).parents(".item").attr("data-item-id")
        let item = this.actor.items.get(id)
        if (event.button == 2)
            this._createDropdown(event, item._dropdownData())
    }

    _dropdownLeftClick(event) {
        let id = $(event.currentTarget).parents(".item").attr("data-item-id")
        let item = this.actor.items.get(id)
        this._createDropdown(event, item._dropdownData())
    }


    async _createDropdown(event, dropdownData) {
        let dropdownHTML = ""
        event.preventDefault()
        let li = $(event.currentTarget).parents(".item")
        // Toggle expansion for an item
        if (li.hasClass("expanded")) // If expansion already shown - remove
        {
            let summary = li.children(".item-summary");
            summary.slideUp(200, () => summary.remove());
        } else {
            // Add a div with the item summary belowe the item
            let div
            if (!dropdownData) {
                return
            } else {
                dropdownHTML = `<div class="item-summary">${await TextEditor.enrichHTML(dropdownData.text, {async: true})}`;
            }
            if (dropdownData.tags) {
                let tags = `<div class='tags'>`
                dropdownData.tags.forEach(tag => {
                    tags = tags.concat(`<span class='tag'>${tag}</span>`)
                })
                dropdownHTML = dropdownHTML.concat(tags)
            }
            dropdownHTML += "</div>"
            div = $(dropdownHTML)
            li.append(div.hide());
            div.slideDown(200);
        }
        li.toggleClass("expanded");
    }
    _onAdvButtonClick(event) {
        let amt
        if (event.currentTarget.classList.contains("incr")) amt = 1
        else if (event.currentTarget.classList.contains("decr")) amt = -1

        let type = $(event.currentTarget).parents(".adv-buttons").attr("data-type").split("-")
        let target = `data.${type[0]}s.${type[1]}.rating` // Only slightly disgusting

        this.actor.update({ [`${target}`]: getProperty(this.actor._source, target) + amt })
    }

    _onConditionClick(ev) {
        let key = $(ev.currentTarget).parents(".condition").data("key")
        let effect = CONFIG.statusEffects.find(i => i.id == key)
        if (ev.button == 0) { // Left click

            if (effect) {
                let journal = game.journal.get("FWVnJvg0Gy7IMzO7")
                let page = journal.pages.getName(effect.label)
                if (journal)
                    journal.sheet.render(true, {pageId : page.id})
            }
        }
        else if (ev.button == 2) // Right click
        {
            let effect = this.actor.hasCondition(key);
            effect?.sheet.render(true);
        }
    }

    _onItemTraitClick(ev) {
        ev.preventDefault()
        ev.stopPropagation();
        let id = $(event.currentTarget).parents(".item").attr("data-item-id")
        let item = this.actor.items.get(id)
        let traits = Object.values(item.traitList)
        let textClicked = ev.currentTarget.text

        let traitClicked = traits.find(i => i.display == textClicked.trim())


        let description = traitClicked.description || game.wng.config.traitDescriptions[traitClicked.name];

        return this._createDropdown(ev, { text: description })

    }

    _onEffectSelect(ev) {
        let selection = ev.currentTarget.value
        this.actor.addCondition(selection)
    }

    _onItemLabelClick(ev) {
        if (this.actor[ev.currentTarget.dataset.type])
            this.actor[ev.currentTarget.dataset.type]?.sheet?.render(true);
        else ui.notifications.error(`No Item of type ${ev.currentTarget.dataset.type} found`)
    }


}

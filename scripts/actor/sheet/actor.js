import ActorConfigure from "../../apps/actor-configure.js";

export class WrathAndGloryActorSheet extends ActorSheet {
    rollData = {};

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["wrath-and-glory", "sheet", "actor"],
            width: 720,
            height: 800,
            resizable: true,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "main",
                },
            ],
            scrollY: [".sheet-body"]
        });
    }

    get template() {
        return `systems/wrath-and-glory/template/actor/${this.actor.type}.html`
    }

    getData() {
        const sheetData = super.getData();
        sheetData.data = sheetData.data.data // project system data so that handlebars has the same name and value paths
        this.constructItemLists(sheetData)
        this.constructEffectLists(sheetData)
        this._organizeSkills(sheetData)
        sheetData.autoCalc = this.actor.getFlag("wrath-and-glory", "autoCalc") || {}
        if (this.actor.type == "threat")
        {
            sheetData.autoCalc.wounds = false;
            sheetData.autoCalc.shock = false;
        }
        return sheetData;
    }

    
    _organizeSkills(sheetData) {
        let middle = Object.values(sheetData.data.skills).length / 2;
        let i = 0;
        for (let skill of Object.values(sheetData.data.skills)) {
            skill.isLeft = i < middle;
            skill.isRight = i >= middle;
            i++;
        }
    }

    _attributeAndSkillTooltips(sheetData) {

        for (let attribute of Object.values(sheetData.data.attributes)) {
            attribute.tooltip = `Rating: ${attribute.rating} | Advance Cost: ${game.wng.utility.getAttributeCostIncrement(attribute.rating + 1)} | Current XP: ${this.actor.experience.current}`
        }

        for (let skill of Object.values(sheetData.data.skills)) {
            skill.tooltip = `Rating: ${skill.rating} | Advance Cost: ${game.wng.utility.getSkillCostIncrement(skill.rating + 1)} | Current XP: ${this.actor.experience.current}`
        }
    }

    constructItemLists(sheetData) 
    {
        let items = {}
        items.equipped = {}

        items.abilities = this.actor.getItemTypes("ability")
        items.talents = this.actor.getItemTypes("talent")
        items.abilitiesAndTalents = items.abilities.concat(items.talents)
        items.ammo = this.actor.getItemTypes("ammo")
        items.armour = this.actor.getItemTypes("armour")
        items.ascensions = this.actor.getItemTypes("ascension")
        items.augmentics = this.actor.getItemTypes("augmentic")
        items.gear = this.actor.getItemTypes("gear")
        items.keywords = this.actor.getItemTypes("keyword")
        items.memorableInjuries = this.actor.getItemTypes("memorableInjury")
        items.mutations = this.actor.getItemTypes("mutation")
        items.psychicPowers = this.actor.getItemTypes("psychicPower")
        items.traumaticInjuries = this.actor.getItemTypes("traumaticInjury")
        items.weaponUpgrades = this.actor.getItemTypes("weaponUpgrade")

        items.equipped.weapons = this.actor.getItemTypes("weapon").filter(i => i.equipped)
        items.equipped.armour = this.actor.getItemTypes("armour").filter(i => i.equipped)
        items.equipped.ammo = items.equipped.weapons.map(i => this.actor.items.get(i.ammo)).filter(i => !!i).filter((item, index, self) => self.findIndex(dup => dup.id == item.id) == index) //remove duplicate

        sheetData.items = items;

        this.constructInventory(sheetData)
    }

    constructInventory(sheetData)
    {
        sheetData.inventory = {
            weapons : {
                header : "HEADER.WEAPON",
                items : this.actor.getItemTypes("weapon"),
                equippable : true,
                quantity : true,
                type : "weapon"
            },
            armour : {
                header : "HEADER.ARMOUR",
                items : this.actor.getItemTypes("armour"),
                equippable : true,
                quantity : true,
                type : "armour"
            },
            gear : {
                header : "HEADER.GEAR",
                items : this.actor.getItemTypes("gear"),
                equippable : false,
                quantity : true,
                type : "gear"
            },
            ammo : {
                header : "HEADER.AMMO",
                items : this.actor.getItemTypes("ammo"),
                equippable : false,
                quantity : true,
                type : "ammo"
            },
            weaponUpgrades : {
                header : "HEADER.WEAPON_UPGRADE",
                items : this.actor.getItemTypes("weaponUpgrade"),
                equippable : false,
                quantity : false,
                type : "weaponUpgrade"
            },
            augmentics : {
                header : "HEADER.AUGMETIC",
                items : this.actor.getItemTypes("augmentic"),
                equippable : false,
                quantity : false,
                type : "augmentic"
            }
        }
    }

    constructEffectLists(sheetData) 
    {
        let effects = {}
        
        effects.conditions = CONFIG.statusEffects.map(i => {
            return {
                label : i.label,
                key : i.id,
                img : i.icon,
                existing : this.actor.hasCondition(i.id)
            }
        })  
        effects.temporary = sheetData.actor.effects.filter(i => i.isTemporary && !i.data.disabled && !i.isCondition)
        effects.disabled = sheetData.actor.effects.filter(i => i.data.disabled && !i.isCondition)
        effects.passive = sheetData.actor.effects.filter(i => !i.isTemporary && !i.data.disabled && !i.isCondition)

        sheetData.effects = effects;
    }


    _onDrop(ev)
    {
        let data = ev.dataTransfer.getData("text/plain")
        if (data)
        {
            data = JSON.parse(data)
            if (data.type == "itemDrop")
                this.actor.createEmbeddedDocuments("Item", [data.payload])
            else
                super._onDrop(ev)
        }
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
        html.find(".roll-attribute").click(this._onAttributeClick.bind(this));
        html.find(".roll-skill").click(this._onSkillClick.bind(this));
        html.find(".roll-determination").click(this._onDeterminationClick.bind(this));
        html.find(".roll-conviction").click(this._onConvictionClick.bind(this));
        html.find(".roll-resolve").click(this._onResolveClick.bind(this));
        html.find(".roll-influence").click(this._onInfluenceClick.bind(this));
        html.find(".roll-weapon").click(this._onWeaponClick.bind(this));
        html.find(".roll-psychic-power").click(this._onPowerClick.bind(this));
        html.find(".checkbox").click(this._onCheckboxClick.bind(this))
        html.find(".property-edit").change(this._onSelectChange.bind(this))
        html.find(".qty-click").click(this._onQuantityClick.bind(this))
        html.find(".show-adv").mouseenter(this._onAdvHover.bind(this))
        html.find(".show-adv").mouseleave(this._onAdvLeave.bind(this))
        html.find(".adv-buttons button").click(this._onAdvButtonClick.bind(this))
        html.find(".condition-toggle").click(this._onConditionToggle.bind(this))
        html.find(".condition-click").click(this._onConditionClick.bind(this));
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
                    label : "BUTTON.CONFIGURE",
                    class : "actor-configure",
                    icon : "fas fa-wrench",
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
             name : `New ${game.i18n.localize("ITEM.Type" + header.type.toLowerCase().capitalize())}`,
             type : header.type
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
        this.actor.deleteEmbeddedDocuments("Item", [div.data("itemId")]);
        div.slideUp(200, () => this.render(false));
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
        let effectData = { label: "New Effect" , icon: "icons/svg/aura.svg"}
        if (type == "temporary") {
            effectData["duration.rounds"] = 1;
          }

        let html = await renderTemplate("systems/wrath-and-glory/template/apps/quick-effect.html")
        let dialog = new Dialog({
            title : "Quick Effect",
            content : html,
            buttons : {
                "create" : {
                    label : "Create",
                    callback : html => {
                        let mode = 2
                        let label = html.find(".label").val()
                        let key = html.find(".key").val()
                        let value = parseInt(html.find(".modifier").val())
                        effectData.label = label
                        effectData.changes = [{key, mode, value}]
                        this.actor.createEmbeddedDocuments("ActiveEffect", [effectData])
                    }
                },
                "skip" : {
                    label : "Skip",
                    callback : () => this.actor.createEmbeddedDocuments("ActiveEffect", [effectData])
                }
            }
        })
        await dialog._render(true)
        dialog._element.find(".label").select()

 
      }

    _onEffectEdit(ev)
    {
        let id = $(ev.currentTarget).parents(".item").attr("data-item-id")
        this.object.effects.get(id).sheet.render(true)
    }

    _onEffectDelete(ev)
    {
        let id = $(ev.currentTarget).parents(".item").attr("data-item-id")
        this.object.deleteEmbeddedDocuments("ActiveEffect", [id])
    }

    _onEffectToggle(ev)
    {
        let id = $(ev.currentTarget).parents(".item").attr("data-item-id")
        let effect = this.object.effects.get(id)

        effect.update({"disabled" : !effect.data.disabled})
    }

    _onFocusIn(event) {
        $(event.currentTarget).select();
    }

    async _onRollableAbilityClick(ev) {
        const div = $(event.currentTarget).parents(".item");
        const item = this.actor.items.get(div.data("itemId"));
        
        if (ev.button == 0)
        {
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

        if (img.style.display == "none")
        {
            img.style.display = "flex";
            Array.from(li.find(".dice")).forEach(d => d.remove())
        }
        else
        {
            $(img).after("<div class='dice'><i class='fas fa-dice'></i></div>")
            img.style.display = "none"
        }
    }

    async _prepareCustomRoll() {
        this._resetRollData();
        return prepareCommonRoll(this.rollData);
    }

    async _prepareReroll() {
        return reroll(this.rollData);
    }

    async _prepareDamageRoll() {
        this._resetRollData();
        this.rollData.weapon = {
            damage: {
                base: 0,
                rank: "none",
                bonus: 0
            },
            ed: {
                base: 0,
                rank: "none",
                bonus: 0,
                die: {
                    one: 0,
                    two: 0,
                    three: 0,
                    four: 1,
                    five: 1,
                    six: 2
                }
            },
            ap: {
                base: 0,
                rank: "none",
                bonus: 0
            },
            traits: ""
        }
        this.rollData.name = "ROLL.DAMAGE";
        return prepareDamageRoll(this.rollData);
    }

    async _onAttributeClick(event) {
        event.preventDefault();
        const attribute = $(event.currentTarget).data("attribute");
        let test = await  this.actor.setupAttributeTest(attribute)
        await test.rollTest();
        test.sendToChat()
    }

    async _onSkillClick(event) {
        event.preventDefault();
        const skill = $(event.currentTarget).data("skill");
        let test = await this.actor.setupSkillTest(skill)
        await test.rollTest();
        test.sendToChat()
    }

    async _onDeterminationClick(event) {
        event.preventDefault();
        let test = await this.actor.setupGenericTest("determination")
        await test.rollTest();
        test.sendToChat()
    }

    async _onConvictionClick(event) {
        event.preventDefault();
        this._resetRollData();

        new Dialog({
            title : "Conviction Roll",
            buttons : {
                "corruption" : {
                    label : "Corruption",
                    callback : async () => {
                        let test = await this.actor.setupGenericTest("corruption")
                        await test.rollTest();
                        test.sendToChat()

                    }
                },
                "mutation" : {
                    label : "Mutation",
                    callback : async () => {
                        let test = await this.actor.setupGenericTest("mutation")
                        await test.rollTest();
                        test.sendToChat()
                    }
                }
            }
        }).render(true)
    }

    async _onResolveClick(event) {
        event.preventDefault();
        new Dialog({
            title : "Resolve Roll",
            buttons : {
                "corruption" : {
                    label : "Fear",
                    callback : async () => {
                        let test = await this.actor.setupGenericTest("fear")
                        await test.rollTest();
                        test.sendToChat()

                    }
                },
                "mutation" : {
                    label : "Terror",
                    callback : async () => {
                        let test = await this.actor.setupGenericTest("terror")
                        await test.rollTest();
                        test.sendToChat()
                    }
                }
            }
        }).render(true)
    }

    async _onInfluenceClick(event) {
        event.preventDefault();
        let test = await this.actor.setupGenericTest("influence")
        await test.rollTest();
        test.sendToChat()
    }

    async _onWeaponClick(event) {
        event.preventDefault();
        const div = $(event.currentTarget).parents(".item");
        let test = await this.actor.setupWeaponTest(div.data("itemId"))
        await test.rollTest();
        test.sendToChat()
    }

    async _onPowerClick(event) {
        event.preventDefault();
        const div = $(event.currentTarget).parents(".item");
        let test = await this.actor.setupPowerTest(div.data("itemId"))
        await test.rollTest();
        test.sendToChat()
    }

    _onConditionToggle(event) {
        let key = $(event.currentTarget).parents(".condition").attr("data-key")
        if (this.actor.hasCondition(key))
            this.actor.removeCondition(key)
        else
            this.actor.addCondition(key)
    }

    async _prepareRollPsychicPower(event) {
        event.preventDefault();
        this._resetRollData();
        const div = $(event.currentTarget).parents(".item");
        const psychicPower = this.actor.items.get(div.data("itemId"));
        const skill = this.actor.skills.psychicMastery;
        this.rollData.difficulty.target = psychicPower.dn;
        this.rollData.name = psychicPower.data.name;
        this.rollData.weapon = {
            damage: {
                base: psychicPower.damage.base,
                rank: psychicPower.damage.rank,
                bonus: psychicPower.damage.bonus
            },
            ed: {
                base: psychicPower.ed.base,
                rank: psychicPower.ed.rank,
                bonus: psychicPower.ed.bonus,
                die: psychicPower.ed.die
            },
            potency: psychicPower.potency
        };
        this.rollData.wrath.isPsy = true;
        this.rollData.wrath.isCommon = false;
        this.rollData.pool.size = skill.total;
        this.rollData.skillName = skill.label;
        this.rollData.name = psychicPower.data.name;
        return preparePsychicRoll(this.rollData);
    }

    _resetRollData() {
        let rank = 0;
        if (this.actor.advances) {
            rank = this.actor.advances.rank;
        }
        this.rollData = {
            name: "DIALOG.CUSTOM_ROLL",
            rank: rank,
            difficulty: {
                target: 3,
                penalty: 0,
                rank: "none"
            },
            pool: {
                size: 1,
                bonus: 0,
                rank: "none"
            },
            wrath: {
                base: 1,
                isPsy: false,
                isCommon: true,
                isWeapon: false
            },
            result: {
                dice: [],
                wrath: 0,
                isSuccess: false,
                isWrathCriticals: false,
                isWrathComplications: false
            },
            rolls: {
                hit: [],
                damage: []
            }
        };
    }

    _getConvictionPenalty() {
        let corruption = this.actor.corruption.current;
        if (corruption > 20) {
            return 4;
        } else if (corruption > 15) {
            return 3;
        } else if (corruption > 10) {
            return 2;
        } else if (corruption > 5) {
            return 1;
        } else {
            return 0;
        }
    }

    _onCheckboxClick(event) {
        let target = $(event.currentTarget).attr("data-target")
        if (target == "item") {
            target = $(event.currentTarget).attr("data-item-target")
            let item = this.actor.items.get($(event.currentTarget).parents(".item").attr("data-item-id"))
            return item.update({ [`${target}`]: !getProperty(item.data, target) })
        }
        if (target)
            return this.actor.update({[`${target}`] : !getProperty(this.actor.data, target)});
    }

    _onSelectChange(event)
    {
        let target = $(event.currentTarget).attr("data-target")
        let id = $(event.currentTarget).parents(".item").attr("data-item-id")
        let item = this.actor.items.get(id)
        return item.update({[target] : event.target.value})    
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
        item.update({"data.quantity" : item.quantity + 1 * multiplier})
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

    
    _createDropdown(event, dropdownData) {
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
                dropdownHTML = `<div class="item-summary">${TextEditor.enrichHTML(dropdownData.text)}`;
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

    _onAdvHover(event)
    {
        $(event.currentTarget).children(".adv-buttons")[0].style="display: flex"
    }

    _onAdvLeave(event)
    {
        $(event.currentTarget).children(".adv-buttons")[0].style="display: none"
    }

    _onAdvButtonClick(event) 
    {
        let amt
        if (event.currentTarget.classList.contains("incr")) amt = 1
        else if (event.currentTarget.classList.contains("decr")) amt = -1

        let type = $(event.currentTarget).parents(".adv-buttons").attr("data-type").split("-")
        let target = `data.${type[0]}s.${type[1]}.rating` // Only slightly disgusting

        this.actor.update({[`${target}`] : getProperty(this.actor.data._source, target) + amt})
    }

    _onConditionClick(ev)
    {
        let key = $(ev.currentTarget).parents(".condition").data("key")
        let effect = CONFIG.statusEffects.find(i => i.id == key)
        if (effect)
        {
            let journal = game.journal.getName(effect.label)
            if (journal)
                journal.sheet.render(true)
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

        let description = game.wng.config.traitDescriptions[traitClicked.name];

        return this._createDropdown(ev, {text : description})

    }

  
}

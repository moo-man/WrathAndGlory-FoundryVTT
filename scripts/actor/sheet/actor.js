import { prepareCommonRoll, prepareWeaponRoll, prepareDamageRoll, preparePsychicRoll } from "../../common/dialog.js";
import { reroll } from "../../common/roll.js";

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
        return sheetData;
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
        items.equipped.ammo = items.equipped.weapons.map(i => this.actor.items.get(i.ammo)).filter(i => !!i)

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
                header : "HEADER.AUGMENTIC",
                items : this.actor.getItemTypes("augmentic"),
                equippable : false,
                quantity : false,
                type : "augmentic"
            }
        }
    }


    activateListeners(html) {
        super.activateListeners(html);
        html.find("select").click(ev => ev.stopPropagation())
        html.find(".item-dropdown").mousedown(this._dropdownLeftClick.bind(this))
        html.find(".item-dropdown-right").mousedown(this._dropdownRightClick.bind(this))
        html.find(".item-create").mousedown(this._onItemCreate.bind(this));
        html.find(".item-edit").mousedown(this._onItemEdit.bind(this));
        html.find(".item-delete").mousedown(this._onItemDelete.bind(this));
        html.find("input").focusin(this._onFocusIn.bind(this));
        html.find(".roll-attribute").click(this._prepareRollAttribute.bind(this));
        html.find(".roll-skill").click(this._prepareRollSkill.bind(this));
        html.find(".roll-stealth").click(this._prepareRollStealthScore.bind(this));
        html.find(".roll-determination").click(this._prepareRollDetermination.bind(this));
        html.find(".roll-conviction").click(this._prepareRollConviction.bind(this));
        html.find(".roll-resolve").click(this._prepareRollResolve.bind(this));
        html.find(".roll-influence").click(this._prepareRollInfluence.bind(this));
        html.find(".roll-weapon").click(this._prepareRollWeapon.bind(this));
        html.find(".roll-psychic-power").click(this._prepareRollPsychicPower.bind(this));
        html.find(".checkbox").click(this._onCheckboxClick.bind(this))
        html.find(".property-edit").change(this._onSelectChange.bind(this))
        html.find(".qty-click").click(this._onQuantityClick.bind(this))

    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        if (this.actor.isOwner) {
            buttons = [
                {
                    label: "BUTTON.ROLL",
                    class: "custom-roll",
                    icon: "fas fa-dice",
                    onclick: (ev) => this._prepareCustomRoll()
                },
                {
                    label: "BUTTON.REROLL",
                    class: "reroll",
                    icon: "fas fa-redo",
                    onclick: (ev) => this._prepareReroll()
                },
                {
                    label: "BUTTON.DAMAGE",
                    class: "damage",
                    icon: "fas fa-tint",
                    onclick: (ev) => this._prepareDamageRoll()
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

    _onFocusIn(event) {
        $(event.currentTarget).select();
    }

    _prepareCustomRoll() {
        this._resetRollData();
        return prepareCommonRoll(this.rollData);
    }

    _prepareReroll() {
        return reroll(this.rollData);
    }

    _prepareDamageRoll() {
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

    _prepareRollAttribute(event) {
        event.preventDefault();
        this._resetRollData();
        const attributeName = $(event.currentTarget).data("attribute");
        const attribute = this.actor.attributes[attributeName];
        this.rollData.name = attribute.label;
        this.rollData.pool.size = attribute.total;
        return prepareCommonRoll(this.rollData);
    }

    _prepareRollSkill(event) {
        event.preventDefault();
        this._resetRollData();
        const skillName = $(event.currentTarget).data("skill");
        const skill = this.actor.skills[skillName];
        this.rollData.name = skill.label;
        this.rollData.pool.size = skill.total;
        return prepareCommonRoll(this.rollData);
    }

    _prepareRollStealthScore(event) {
        event.preventDefault();
        this._resetRollData();
        const skill = this.actor.skills.stealth;
        this.rollData.name = skill.label;
        this.rollData.difficulty.target = 0;
        this.rollData.pool.size = skill.total;
        return prepareCommonRoll(this.rollData);
    }

    _prepareRollDetermination(event) {
        event.preventDefault();
        this._resetRollData();
        this.rollData.name = "ROLL.DETERMINATION";
        this.rollData.pool.size = this.actor.combat.determination.total;
        return prepareCommonRoll(this.rollData);
    }

    _prepareRollConviction(event) {
        event.preventDefault();
        this._resetRollData();
        this.rollData.name = "ROLL.CONVICTION";
        this.rollData.pool.size = this.actor.combat.conviction.total;
        this.rollData.difficulty.penalty = this._getConvictionPenalty();
        return prepareCommonRoll(this.rollData);
    }

    _prepareRollResolve(event) {
        event.preventDefault();
        this._resetRollData();
        this.rollData.name = "ROLL.RESOLVE";
        this.rollData.pool.size = this.actor.combat.resolve.total;
        return prepareCommonRoll(this.rollData);
    }

    _prepareRollInfluence(event) {
        event.preventDefault();
        this._resetRollData();
        this.rollData.name = "ROLL.INFLUENCE";
        this.rollData.pool.size = this.actor.resources.influence;
        return prepareCommonRoll(this.rollData);
    }

    _prepareRollWeapon(event) {
        event.preventDefault();
        this._resetRollData();
        const div = $(event.currentTarget).parents(".item");
        const weapon = this.actor.items.get(div.data("itemId"));
        let skill;
        this.rollData.weapon = {
            damage: {
                base: weapon.damage.base,
                rank: weapon.damage.rank,
                bonus: weapon.damage.bonus
            },
            ed: {
                base: weapon.ed.base,
                rank: weapon.ed.rank,
                bonus: weapon.ed.bonus,
                die: weapon.ed.die
            },
            ap: {
                base: weapon.ap.base,
                rank: weapon.ap.rank,
                bonus: weapon.ap.bonus
            },
            traits: weapon.traits
        };
        if (weapon.category === "melee") {
            skill = this.actor.skills.weaponSkill;
            let strength = this.actor.attributes.strength;
            this.rollData.weapon.damage.bonus = strength.total;
        } else {
            skill = this.actor.skills.ballisticSkill;
        }
        this.rollData.wrath.isWeapon = true;
        this.rollData.wrath.isCommon = false;
        this.rollData.skillName = skill.label;
        this.rollData.name = weapon.data.name;
        this.rollData.pool.size = skill.total;
        this.rollData.pool.bonus = weapon.attack.base + weapon.attack.bonus;
        this.rollData.pool.rank = weapon.attack.rank;
        return prepareWeaponRoll(this.rollData);
    }

    _prepareRollPsychicPower(event) {
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
        if (item && event.button == 0)
            this._createDropdown(event, item._dropdownData())
        else if (item)
            item.sheet.render(true)
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
}

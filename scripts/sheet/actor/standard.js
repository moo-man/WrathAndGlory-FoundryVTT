import { BaseWnGActorSheet } from "./base.js";

export class StandardActorSheet extends BaseWnGActorSheet {
    rollData = {};


    async getData() {
        const sheetData = await super.getData();
        this.constructItemLists(sheetData)
        this._organizeSkills(sheetData)
        sheetData.autoCalc = this.actor.getFlag("wrath-and-glory", "autoCalc") || {}
        
        return sheetData;
    }



    _organizeSkills(sheetData) {
        let middle = Object.values(sheetData.system.skills).length / 2;
        let i = 0;
        for (let skill of Object.values(sheetData.system.skills)) {
            skill.isLeft = i < middle;
            skill.isRight = i >= middle;
            i++;
        }
    }

    constructItemLists(sheetData) {
        let items = {}
        items.equipped = {}

        items.abilities = this.actor.itemTypes.ability
        items.talents = this.actor.itemTypes.talent
        items.abilitiesAndTalents = items.abilities.concat(items.talents)
        items.ammo = this.actor.itemTypes.ammo
        items.armour = this.actor.itemTypes.armour
        items.ascensions = this.actor.itemTypes.ascension
        items.augmentics = this.actor.itemTypes.augmentic
        items.gear = this.actor.itemTypes.gear
        items.keywords = this.actor.itemTypes.keyword
        items.memorableInjuries = this.actor.itemTypes.memorableInjury
        items.mutations = this.actor.itemTypes.mutation
        items.psychicPowers = this.actor.itemTypes.psychicPower
        items.traumaticInjuries = this.actor.itemTypes.traumaticInjury
        items.weaponUpgrades = this.actor.itemTypes.weaponUpgrade

        items.equipped.weapons = this.actor.itemTypes.weapon.filter(i => i.equipped)
        items.equipped.armour = this.actor.itemTypes.armour.filter(i => i.equipped)
        items.equipped.ammo = items.equipped.weapons.map(i => this.actor.items.get(i.ammo)).filter(i => !!i).filter((item, index, self) => self.findIndex(dup => dup.id == item.id) == index) //remove duplicate

        sheetData.items = items;

        this.constructInventory(sheetData)
    }

    constructInventory(sheetData) {
        sheetData.inventory = {
            weapons: {
                header: "HEADER.WEAPON",
                items: this.actor.itemTypes.weapon,
                equippable: true,
                quantity: true,
                type: "weapon"
            },
            armour: {
                header: "HEADER.ARMOUR",
                items: this.actor.itemTypes.armour,
                equippable: true,
                quantity: true,
                type: "armour"
            },
            gear: {
                header: "HEADER.GEAR",
                items: this.actor.itemTypes.gear,
                equippable: false,
                quantity: true,
                type: "gear"
            },
            ammo: {
                header: "HEADER.AMMO",
                items: this.actor.itemTypes.ammo,
                equippable: false,
                quantity: true,
                type: "ammo"
            },
            weaponUpgrades: {
                header: "HEADER.WEAPON_UPGRADE",
                items: this.actor.itemTypes.weaponUpgrade,
                equippable: false,
                quantity: false,
                type: "weaponUpgrade"
            },
            augmentics: {
                header: "HEADER.AUGMETIC",
                items: this.actor.itemTypes.augmentic,
                equippable: false,
                quantity: false,
                type: "augmentic"
            }
        }
    }

    constructEffectLists(sheetData) {
        let effects = {
            temporary : [],
            disabled : [],
            passive : []
        }

        for(let e of Array.from(sheetData.actor.allApplicableEffects()))
        {
            if (e.isTemporary && !e.disabled)
            {
                effects.temporary.push(e);
            }
            else if (e.disabled)
            {
                effects.disabled.push(e);
            }
            else
            {
                effects.passive.push(e);
            }
        }

        effects.conditions = CONFIG.statusEffects.map(i => {
            return {
                name: i.name,
                key: i.id,
                img: i.img,
                existing: this.actor.hasCondition(i.id)
            }
        })

        sheetData.effects = effects;
    }


    _onDrop(ev) {
        let data = ev.dataTransfer.getData("text/plain")
        if (data) {
            data = JSON.parse(data)
            if (data.type == "itemFromChat")
                return this.actor.createEmbeddedDocuments("Item", [data.payload])
            else if (data.type == "keywordDrop") {
                let name = data.payload
                let item = game.items.find(i => i.name == name && i.type == "keyword")
                return this.actor.createEmbeddedDocuments("Item", [item.toObject()])
            }
            else if (data.type == "Item") {
                Item.implementation.fromDropData(data).then(item => {
                    if (item.type == "archetype")
                    {
                        Dialog.confirm({
                            title: this.actor.type == "agent" ? "Character Creation" : "Apply Archetype",
                            content: `<p>${this.actor.type == "agent" ? "Begin Character Creation?" : "Apply Archetype data to this Actor?"}</p>`,
                            yes: () => this.actor.applyArchetype(item, true),
                            no: () => this.actor.applyArchetype(item, false)
                        })
                    }
                });
            }
        }
        super._onDrop(ev)
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".roll-attribute").click(this._onAttributeClick.bind(this));
        html.find(".roll-skill").click(this._onSkillClick.bind(this));
        html.find(".roll-determination").click(this._onDeterminationClick.bind(this));
        html.find(".roll-conviction").click(this._onConvictionClick.bind(this));
        html.find(".roll-resolve").click(this._onResolveClick.bind(this));
        html.find(".roll-influence").click(this._onInfluenceClick.bind(this));
        html.find(".roll-weapon").click(this._onWeaponClick.bind(this));
        html.find(".roll-psychic-power").click(this._onPowerClick.bind(this));
        html.find(".roll-stealth").click(this._onStealthClick.bind(this));

        html.find(".items .item").each((i, e) => {
            e.draggable = true;
        })
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

        }
        else
            this._dropdownRightClick(ev)
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
         this.actor.setupAttributeTest(attribute)
    }

    async _onSkillClick(event) {
        event.preventDefault();
        const skill = $(event.currentTarget).data("skill");
        this.actor.setupSkillTest(skill)
    }

    async _onDeterminationClick(event) {
        event.preventDefault();
        this.actor.setupGenericTest("determination")
    }

    async _onStealthClick(event) {
        event.preventDefault();
        this.actor.setupGenericTest("stealth")
    }

    async _onConvictionClick(event) {
        event.preventDefault();
        this._resetRollData();

        new Dialog({
            title: "Conviction Roll",
            buttons: {
                "corruption": {
                    label: "Corruption",
                    callback: async () => {
                        this.actor.setupGenericTest("corruption")

                    }
                },
                "mutation": {
                    label: "Mutation",
                    callback: async () => {
                        this.actor.setupGenericTest("mutation")
                    }
                }
            }
        }).render(true)
    }

    async _onResolveClick(event) {
        event.preventDefault();
        new Dialog({
            title: "Resolve Roll",
            buttons: {
                "corruption": {
                    label: "Fear",
                    callback: async () => {
                        this.actor.setupGenericTest("fear")

                    }
                },
                "mutation": {
                    label: "Terror",
                    callback: async () => {
                        this.actor.setupGenericTest("terror")
                    }
                }
            }
        }).render(true)
    }

    async _onInfluenceClick(event) {
        event.preventDefault();
        this.actor.setupGenericTest("influence")
    }

    async _onWeaponClick(event) {
        event.preventDefault();
        const div = $(event.currentTarget).parents(".item");
        this.actor.setupWeaponTest(div.data("itemId"))
    }

    async _onPowerClick(event) {
        event.preventDefault();
        const div = $(event.currentTarget).parents(".item");
        await this.actor.setupPowerTest(div.data("itemId"))
    }

    async _prepareRollPsychicPower(event) {
        event.preventDefault();
        this._resetRollData();
        const div = $(event.currentTarget).parents(".item");
        const psychicPower = this.actor.items.get(div.data("itemId"));
        const skill = this.actor.system.skills.psychicMastery;
        this.rollData.difficulty.target = psychicPower.dn;
        this.rollData.name = psychicPower.name;
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
        this.rollData.name = psychicPower.name;
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
}

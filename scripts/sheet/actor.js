import { prepareCommonRoll, prepareWeaponRoll, prepareDamageRoll, preparePsychicRoll } from "../common/dialog.js";
import { reroll } from "../common/roll.js";

export class WrathAndGloryActorSheet extends ActorSheet {
    rollData = {};

    getData() {
        const data = super.getData();
        data.data = data.data.data // project system data so that handlebars has the same name and value paths
        return data;
    }
    

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".item-create").click(ev => this._onItemCreate(ev));
        html.find(".item-edit").click(ev => this._onItemEdit(ev));
        html.find(".item-delete").click(ev => this._onItemDelete(ev));
        html.find("input").focusin(ev => this._onFocusIn(ev));
        html.find(".roll-attribute").click(async ev => await this._prepareRollAttribute(ev));
        html.find(".roll-skill").click(async ev => await this._prepareRollSkill(ev));
        html.find(".roll-stealth").click(async ev => await this._prepareRollStealthScore(ev));
        html.find(".roll-determination").click(async ev => await this._prepareRollDetermination(ev));
        html.find(".roll-conviction").click(async ev => await this._prepareRollConviction(ev));
        html.find(".roll-resolve").click(async ev => await this._prepareRollResolve(ev));
        html.find(".roll-influence").click(async ev => await this._prepareRollInfluence(ev));
        html.find(".roll-weapon").click(async ev => await this._prepareRollWeapon(ev));
        html.find(".roll-psychic-power").click(async ev => await this._prepareRollPsychicPower(ev));

    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        if (this.actor.isOwner) {
            buttons = [
                {
                    label: game.i18n.localize("BUTTON.ROLL"),
                    class: "custom-roll",
                    icon: "fas fa-dice",
                    onclick: async (ev) => await this._prepareCustomRoll()
                },
                {
                    label: game.i18n.localize("BUTTON.REROLL"),
                    class: "reroll",
                    icon: "fas fa-redo",
                    onclick: async (ev) => await this._prepareReroll()
                },
                {
                    label: game.i18n.localize("BUTTON.DAMAGE"),
                    class: "damage",
                    icon: "fas fa-tint",
                    onclick: async (ev) => await this._prepareDamageRoll()
                }
            ].concat(buttons);
        }
        return buttons;
    }

    _onItemCreate(event) {
        event.preventDefault();
        let header = event.currentTarget.dataset
        
        let data = {
             name : `New ${game.i18n.localize("ITEM.Type" + header.type.toLowerCase().capitalize())}`,
             type : header.type
        };
        this.actor.createEmbeddedDocuments("Item", [data], { renderSheet: true });
    }

    _onItemEdit(event) {
        event.preventDefault();
        const div = $(event.currentTarget).parents(".item");
        const item = this.actor.items.get(div.data("itemId"));
        item.sheet.render(true);
    }

    _onItemDelete(event) {
        event.preventDefault();
        const div = $(event.currentTarget).parents(".item");
        this.actor.deleteEmbeddedDocuments("Item", [div.data("itemId")]);
        div.slideUp(200, () => this.render(false));
    }

    _onFocusIn(event) {
        $(event.currentTarget).select();
    }

    async _prepareCustomRoll() {
        this._resetRollData();
        await prepareCommonRoll(this.rollData);
    }

    async _prepareReroll() {
        await reroll(this.rollData);
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
        await prepareDamageRoll(this.rollData);
    }

    async _prepareRollAttribute(event) {
        event.preventDefault();
        this._resetRollData();
        const attributeName = $(event.currentTarget).data("attribute");
        const attribute = this.actor.attributes[attributeName];
        this.rollData.name = attribute.label;
        this.rollData.pool.size = attribute.total;
        await prepareCommonRoll(this.rollData);
    }

    async _prepareRollSkill(event) {
        event.preventDefault();
        this._resetRollData();
        const skillName = $(event.currentTarget).data("skill");
        const skill = this.actor.skills[skillName];
        this.rollData.name = skill.label;
        this.rollData.pool.size = skill.total;
        await prepareCommonRoll(this.rollData);
    }

    async _prepareRollStealthScore(event) {
        event.preventDefault();
        this._resetRollData();
        const skill = this.actor.skills.stealth;
        this.rollData.name = skill.label;
        this.rollData.difficulty.target = 0;
        this.rollData.pool.size = skill.total;
        await prepareCommonRoll(this.rollData);
    }

    async _prepareRollDetermination(event) {
        event.preventDefault();
        this._resetRollData();
        this.rollData.name = "ROLL.DETERMINATION";
        this.rollData.pool.size = this.actor.combat.determination.total;
        await prepareCommonRoll(this.rollData);
    }

    async _prepareRollConviction(event) {
        event.preventDefault();
        this._resetRollData();
        this.rollData.name = "ROLL.CONVICTION";
        this.rollData.pool.size = this.actor.corruption.conviction;
        this.rollData.difficulty.penalty = this._getConvictionPenalty();
        await prepareCommonRoll(this.rollData);
    }

    async _prepareRollResolve(event) {
        event.preventDefault();
        this._resetRollData();
        this.rollData.name = "ROLL.RESOLVE";
        this.rollData.pool.size = this.actor.combat.resolve.total;
        await prepareCommonRoll(this.rollData);
    }

    async _prepareRollInfluence(event) {
        event.preventDefault();
        this._resetRollData();
        this.rollData.name = "ROLL.INFLUENCE";
        this.rollData.pool.size = this.actor.resources.influence;
        await prepareCommonRoll(this.rollData);
    }

    async _prepareRollWeapon(event) {
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
        await prepareWeaponRoll(this.rollData);
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
        await preparePsychicRoll(this.rollData);
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
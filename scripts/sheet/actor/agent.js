import { StandardActorSheet } from "./standard.js";

export class AgentSheet extends StandardActorSheet {


    static get defaultOptions() {
        let options = super.defaultOptions
        options.classes.push("agent")
        return options
    }

    async getData() {
        let sheetData = await super.getData()
        this._attributeAndSkillTooltips(sheetData)
        return sheetData
    }

    _attributeAndSkillTooltips(sheetData) {

        for (let attribute of Object.values(sheetData.system.attributes)) {
            attribute.tooltip = `Rating: ${attribute.rating} | Advance Cost: ${game.wng.utility.getAttributeCostIncrement(attribute.rating + 1)} | Current XP: ${this.actor.experience.current}`
        }

        for (let skill of Object.values(sheetData.system.skills)) {
            skill.tooltip = `Rating: ${skill.rating} | Advance Cost: ${game.wng.utility.getSkillCostIncrement(skill.rating + 1)} | Current XP: ${this.actor.experience.current}`
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".item-cost").focusout(async (ev) => { await this._onItemCostFocusOut(ev); });

        html.find(".roll-objective").on("click", ev =>  {
            if (this.actor.faction)
            {
                let objectives = this.actor.faction.system.objectives;
                let rolled = objectives[Math.floor(CONFIG.Dice.randomUniform() * objectives.length)];
                this.actor.update({"system.bio.objective" : rolled});
            }
        })
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        if (this.actor.isOwner) {
            buttons = [
            ].concat(buttons);
        }
        return buttons;
    }

    async _onItemCostFocusOut(event) {
        event.preventDefault();
        const div = $(event.currentTarget).parents(".item");
        let item  = this.actor.items.get(div.data("itemId"));
        const value = parseInt($(event.currentTarget)[0].value, 10);
        let data = { _id: item.id, "system.cost": value };
        await this.actor.updateEmbeddedDocument("Item", data);
        this._render(true);
    }
}

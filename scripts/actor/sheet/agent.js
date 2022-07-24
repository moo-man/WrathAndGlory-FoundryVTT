import { WrathAndGloryActorSheet } from "./actor.js";

export class AgentSheet extends WrathAndGloryActorSheet {


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

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".item-cost").focusout(async (ev) => { await this._onItemCostFocusOut(ev); });
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
        let data = { _id: item.id, "data.cost": value };
        await this.actor.updateEmbeddedDocument("Item", data);
        this._render(true);
    }
}

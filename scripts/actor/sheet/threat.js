import { WrathAndGloryActorSheet } from "./actor.js";

export class ThreatSheet extends WrathAndGloryActorSheet {

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".item-cost").focusout(async (ev) => { await this._onItemCostFocusOut(ev); });
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        if (this.actor.owner) {
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

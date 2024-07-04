import { StandardActorSheet } from "./standard.js";

export class ThreatSheet extends StandardActorSheet {

    static get defaultOptions() {
        let options = super.defaultOptions
        options.classes.push("threat")
        return options
    }

    async getData() {
        const sheetData = await super.getData();
        sheetData.autoCalc.wounds = false;
        sheetData.autoCalc.shock = false;

        return sheetData;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".item-cost").focusout(async (ev) => { await this._onItemCostFocusOut(ev); });
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

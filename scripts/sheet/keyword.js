import { WrathAndGloryItemSheet } from "./item.js";

export class KeywordSheet extends WrathAndGloryItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["wrath-and-glory", "sheet", "item"],
            template: "systems/wrath-and-glory/template/sheet/keyword.html",
            width: 500,
            height: 412,
            resizable: false,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "description",
                },
            ]
        });
    }

    getData() {
        const data = super.getData();
        return data;
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        return buttons;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}

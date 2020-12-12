import { WrathAndGloryActorSheet } from "./actor.js";

export class PartySheet extends WrathAndGloryActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["wrath-and-glory", "sheet", "actor"],
            template: "systems/wrath-and-glory/template/sheet/party.html",
            width: 700,
            height: 1000,
            resizable: false,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "main",
                },
            ]
        });
    }

    getData() {
        const data = super.getData();
        return data;
    }


    activateListeners(html) {
        super.activateListeners(html);
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        if (this.actor.owner) {
            buttons = [
            ].concat(buttons);
        }
        return buttons;
    }
}

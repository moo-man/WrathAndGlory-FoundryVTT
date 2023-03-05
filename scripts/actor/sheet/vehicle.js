import { BaseWnGActorSheet } from "./base.js";

export class VehicleSheet extends BaseWnGActorSheet {

    static get defaultOptions() {
        let options = super.defaultOptions

        options.classes.push("vehicle");
        options.template = "systems/wrath-and-glory/template/actor/vehicle.html";
        options.width = 700;
        options.height = 1000;
        options.resizable = true;
        options.tabs = [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main", }]
        return options
    }

    getData() {
        const data = super.getData();
        return data;
    }


    activateListeners(html) {
        super.activateListeners(html);
    }

}

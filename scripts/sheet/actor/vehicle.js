import ItemTraits from "../../apps/item-traits.js";
import { BaseWnGActorSheet } from "./base.js";

export class VehicleSheet extends BaseWnGActorSheet {

    static get defaultOptions() {
        let options = super.defaultOptions

        options.classes.push("vehicle");
        options.template = "systems/wrath-and-glory/template/actor/vehicle.hbs";
        options.resizable = true;
        options.tabs = [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main", }]
        options.dragDrop.concat([{dragSelector: ".actor-list .actor"}, {}])
        options.scrollY.push(".main-lists");

        return options
    }

    async getData() {
        const data = await super.getData();
        this.constructItemLists(data);
        data.complement = {
            pilot : [],
            crew : [],
            passenger : [],
            unassigned : []
        }
        data.system.complement.list.forEach((i, index) => {
            data.complement[i.type || "unassigned"].push(mergeObject(i, {index}));
        })

        data.complement.pilot = this._padComplementList(data.complement.pilot, data.system.complement.pilot)
        data.complement.crew = this._padComplementList(data.complement.crew, data.system.complement.crew)
        data.complement.passenger = this._padComplementList(data.complement.passenger, data.system.complement.passenger)
        return data;
    }

    constructEffectLists(sheetData) {
        super.constructEffectLists(sheetData);

        sheetData.effects.conditions = sheetData.effects.conditions.filter(i => ["onfire", "hindered", "restrained", "vulnerable"].includes(i.key))
    }

    constructItemLists(sheetData) {
        let items = {}

        items.ammo = this.actor.itemTypes.ammo
        items.gear = this.actor.itemTypes.gear
        items.keywords = this.actor.itemTypes.keyword
        items.weapons = this.actor.itemTypes.weapon
        items.equipped = {
            weapons : items.weapons.filter(i => i.system.equipped),    
        }

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
        }
    }


    _padComplementList(array, size)
    {
        if (array.length < size)
        {
            array = array.concat(Array(size - array.length).fill(undefined));
        }
        return array
    }

      /** @inheritdoc */
  _onDragStart(event) {
    const li = event.currentTarget;
    if (li.dataset.complementId)
    {
        event.dataTransfer.setData("text/plain", JSON.stringify({type : "complementDrag", index : li.dataset.index}));
    }
    else super._onDragStart(event);
  }

    async _onDrop(ev) {
        let data = JSON.parse(ev.dataTransfer.getData("text/plain"));
        let complementType = ev.target.dataset.type || $(ev.target).parents(".complement-list")[0]?.dataset?.type
        if (data.type == "Actor" && data.uuid)
        {
            let actor = await fromUuid(data.uuid);
            this.actor.update({"system.complement.list" : this.actor.system.complement.add({id : actor.id, type: complementType})})
        }
        else if (data.type == "complementDrag")
        {
            this.actor.update({"system.complement.list" : this.actor.system.complement.edit(data.index, {type: complementType})});
        }
        super._onDrop(ev)
    }


    activateListeners(html) {
        super.activateListeners(html);

        html.find(".complement-delete").click(ev => {
            let index = $(ev.currentTarget).parents(".item").attr("data-index");

            this.actor.update({"system.complement.list" : this.actor.system.complement.remove(index)})
        })

        html.find(".vehicle-traits").click(ev => {
            new ItemTraits(this.object).render(true)
        })

        html.find(".roll-weapon").click(async ev => {
            let actor = await this.actor.system.complement.choose();
            const div = $(ev.currentTarget).parents(".item");
            let id = div.data("itemId");
            let weapon = this.actor.items.get(id);
            if (weapon)
            {
                actor.setupWeaponTest(weapon);
            }
        });
    }

}

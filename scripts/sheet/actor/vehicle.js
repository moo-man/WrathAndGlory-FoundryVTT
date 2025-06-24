import ItemTraits from "../../apps/item-traits";
import WnGActorSheet from "./actor";

export class VehicleSheet extends WnGActorSheet {
    static DEFAULT_OPTIONS = {
        actions: {
            deleteComplement: this._onDeleteComplement,
            configureTraits : this._onConfigureTraits,
            rollWeapon : this._onRollWeapon,
            openComplement : this._onOpenComplement
        },
        dragDrop: [{ dragSelector: '.list-row[data-complement]', dropSelector: null }],
    }


    static PARTS = {
        header: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/vehicle/vehicle-header.hbs', classes: ["sheet-header"] },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        main: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/vehicle/vehicle-main.hbs' },
        effects: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-effects.hbs' },
        gear: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-gear.hbs' },
        notes: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/vehicle/vehicle-notes.hbs' },
    }

    static TABS = {
        main: {
            id: "main",
            group: "primary",
            label: "TAB.MAIN",
        },
        effects: {
            id: "effects",
            group: "primary",
            label: "TAB.EFFECTS",
        },
        gear: {
            id: "gear",
            group: "primary",
            label: "TAB.GEAR",
        },
        notes: {
            id: "notes",
            group: "primary",
            label: "TAB.NOTES",
        }
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);

        this.constructItemLists(context);
        context.complement = {
            pilot: [],
            crew: [],
            passenger: [],
            unassigned: []
        }
        context.system.complement.list.forEach((i, index) => {
            context.complement[i.type || "unassigned"].push(mergeObject(i, { index }));
        })

        context.complement.pilot = this._padComplementList(context.complement.pilot, context.system.complement.pilot)
        context.complement.crew = this._padComplementList(context.complement.crew, context.system.complement.crew)
        context.complement.passenger = this._padComplementList(context.complement.passenger, context.system.complement.passenger)
        return context;
    }

    _padComplementList(array, size) {
        if (array.length < size) {
            array = array.concat(Array(size - array.length).fill(undefined));
        }
        return array
    }
    
    _prepareEffectsContext(context) {
        super._prepareEffectsContext(context);

        context.effects.conditions = context.effects.conditions.filter(i => ["onfire", "hindered", "restrained", "vulnerable"].includes(i.key))
    }

    async _onDropActor(data, ev)
    {
        let complementType = ev.target.dataset.type || ev.target.closest(".complement-list")?.dataset?.type
        let actor = await Actor.implementation.fromDropData(data);
        this.actor.update(this.actor.system.complement.add(actor, complementType))
    }

    async _onDropComplementDrag(data, ev)
    {
        let complementType = ev.target.dataset.type || ev.target.closest(".complement-list")?.dataset?.type
        this.actor.update(this.actor.system.complement.edit(data.index, {type: complementType}));
    }

    _onDragStart(ev)
    {
        let complementId = this._getDataAttribute(ev, "complement");
        let index = this._getIndex(ev);
        if (complementId)
        {
            ev.dataTransfer.setData("text/plain", JSON.stringify({type : "ComplementDrag", index}));
        }
        else 
        {
            return super._onDragStart(ev);
        }
    }


    constructItemLists(context) {
        context.items.equipped = {
            weapon: context.items.weapon.filter(i => i.equipped).filter(i => i.system.isActiveMobAbility),
        }
        context.items.equipped.ammo = context.items.equipped.weapon.map(i => i.system.ammo.document).filter(i => !!i).filter((item, index, self) => self.findIndex(dup => dup.id == item.id) == index) //remove duplicate

        this.constructInventory(context)
    }

    constructInventory(context) {
        context.inventory = {
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

    static _onConfigureTraits(ev)
    {
        new ItemTraits(this.document).render(true)
    }

    static async _onRollWeapon(ev)
    {
        let actor = await this.actor.system.complement.choose();
        let weapon = this._getDocument(ev);
        if (weapon)
        {
            actor.setupWeaponTest(weapon);
        }  
    }

    static _onDeleteComplement(ev)
    {
        let index = this._getIndex(ev)
        this.actor.update(this.actor.system.complement.remove(index))
    }

    static _onOpenComplement(ev, target)
    {
        let index = this._getIndex(ev)
        this.actor.system.complement.documents[index]?.sheet.render({force:  true});
    }
}
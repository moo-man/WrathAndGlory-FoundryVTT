import WnGActorSheet from "./actor";

export class StandardActorSheet extends WnGActorSheet {
    static DEFAULT_OPTIONS = {
        actions: {
            toggleCondition: this._onToggleCondition
        },
    }

    _onDropKeyword(data, ev) {

        let item = game.items.find(i => i.name == data.name && i.type == "keyword")
        return this.actor.createEmbeddedDocuments("Item", [item.toObject()])
    }


    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        this.constructItemLists(context)

        return context;
    }



    constructItemLists(context) {
        context.items.abilitiesAndTalents = context.items.ability.concat(context.items.talent)
        context.items.equipped = {
            weapon : context.items.weapon.filter(i => i.equipped).filter(i => i.system.isActiveMobAbility),
            armour : context.items.armour.filter(i => i.equipped).filter(i => i.system.isActiveMobAbility),
            ammo : context.items.weapon.filter(i => i.equipped).filter(i => i.system.isActiveMobAbility).map(i => this.actor.items.get(i.ammo)).filter(i => !!i).filter((item, index, self) => self.findIndex(dup => dup.id == item.id) == index) //remove duplicate
        }

        this.constructInventory(context)

        for (let type in context.items) {
            if (type != "equipped") {
                context.items[type] = context.items[type].filter(i => i.system.isActiveMobAbility);
            }
        }

        for (let type in context.inventory) {
            context.inventory[type].items = context.inventory[type].items.filter(i => i.system.isActiveMobAbility);
        }

    }

    constructInventory(context) {
        context.inventory = {
            weapons: {

                header: "HEADER.WEAPON",
                items: context.items.weapon,
                equippable: true,
                quantity: true,
                type: "weapon"
            },
            armour: {
                header: "HEADER.ARMOUR",
                items: context.items.armour,
                equippable: true,
                quantity: true,
                type: "armour"
            },
            gear: {
                header: "HEADER.GEAR",
                items: context.items.gear,
                equippable: false,
                quantity: true,
                type: "gear"
            },
            ammo: {
                header: "HEADER.AMMO",
                items: context.items.ammo,
                equippable: false,
                quantity: true,
                type: "ammo"
            },
            weaponUpgrades: {
                header: "HEADER.WEAPON_UPGRADE",
                items: context.items.weaponUpgrade,
                equippable: false,
                quantity: false,
                type: "weaponUpgrade"
            },
            augmentics: {
                header: "HEADER.AUGMETIC",
                items: context.items.augmentic,
                equippable: false,
                quantity: false,
                type: "augmentic"
            }
        }
    }

    static _onToggleCondition(ev, target)
    {
        let key = target.dataset.condition;
        if (this.actor.hasCondition(key))
            this.actor.removeCondition(key)
        else
            this.actor.addCondition(key)
    }

}
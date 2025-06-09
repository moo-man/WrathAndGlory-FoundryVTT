import WnGActorSheet from "./actor";

export class StandardActorSheet extends WnGActorSheet {
    static DEFAULT_OPTIONS = {
        actions : {

        },
      }   

      _onDropKeyword(data, ev) 
      {

        let item = game.items.find(i => i.name == data.name && i.type == "keyword")
        return this.actor.createEmbeddedDocuments("Item", [item.toObject()])
        }

      constructItemLists(sheetData) {
        let items = {}
        items.equipped = {}

        items.abilities = this.actor.itemTypes.ability
        items.talents = this.actor.itemTypes.talent
        items.abilitiesAndTalents = items.abilities.concat(items.talents)
        items.ammo = this.actor.itemTypes.ammo
        items.armour = this.actor.itemTypes.armour
        items.ascensions = this.actor.itemTypes.ascension
        items.augmentics = this.actor.itemTypes.augmentic
        items.gear = this.actor.itemTypes.gear
        items.keywords = this.actor.itemTypes.keyword
        items.memorableInjuries = this.actor.itemTypes.memorableInjury
        items.mutations = this.actor.itemTypes.mutation
        items.psychicPowers = this.actor.itemTypes.psychicPower
        items.traumaticInjuries = this.actor.itemTypes.traumaticInjury
        items.weaponUpgrades = this.actor.itemTypes.weaponUpgrade

        items.equipped.weapons = this.actor.itemTypes.weapon.filter(i => i.equipped).filter(i => i.system.isActiveMobAbility)
        items.equipped.armour = this.actor.itemTypes.armour.filter(i => i.equipped).filter(i => i.system.isActiveMobAbility)
        items.equipped.ammo = items.equipped.weapons.map(i => this.actor.items.get(i.ammo)).filter(i => !!i).filter((item, index, self) => self.findIndex(dup => dup.id == item.id) == index) //remove duplicate

        sheetData.items = items;

        this.constructInventory(sheetData)

        for(let type in sheetData.items)
        {
            if (type != "equipped")
            {
                sheetData.items[type] = sheetData.items[type].filter(i => i.system.isActiveMobAbility);
            }
        }

        for(let type in sheetData.inventory)
        {
            sheetData.inventory[type].items = sheetData.inventory[type].items.filter(i => i.system.isActiveMobAbility);
        }
    
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
            armour: {
                header: "HEADER.ARMOUR",
                items: this.actor.itemTypes.armour,
                equippable: true,
                quantity: true,
                type: "armour"
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
            weaponUpgrades: {
                header: "HEADER.WEAPON_UPGRADE",
                items: this.actor.itemTypes.weaponUpgrade,
                equippable: false,
                quantity: false,
                type: "weaponUpgrade"
            },
            augmentics: {
                header: "HEADER.AUGMETIC",
                items: this.actor.itemTypes.augmentic,
                equippable: false,
                quantity: false,
                type: "augmentic"
            }
        }
    }

}
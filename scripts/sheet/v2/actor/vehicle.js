import WnGActorSheet from "./actor";

export class VehicleSheet extends WnGActorSheet {
    static DEFAULT_OPTIONS = {
        actions : {
            
        },
      }   

      async _prepareContext(options)
      {
          let context = await super._prepareContext(options);
          context.conditions = this.formatConditions();

          this.constructItemLists(context);
          context.complement = {
              pilot : [],
              crew : [],
              passenger : [],
              unassigned : []
          }
          context.system.complement.list.forEach((i, index) => {
              context.complement[i.type || "unassigned"].push(mergeObject(i, {index}));
          })
  
          context.complement.pilot = this._padComplementList(context.complement.pilot, context.system.complement.pilot)
          context.complement.crew = this._padComplementList(context.complement.crew, context.system.complement.crew)
          context.complement.passenger = this._padComplementList(context.complement.passenger, context.system.complement.passenger)
          return context;
      }

      _padComplementList(array, size)
      {
          if (array.length < size)
          {
              array = array.concat(Array(size - array.length).fill(undefined));
          }
          return array
      }

      constructItemLists(context) {
        let items = {}

        items.ammo = this.actor.itemTypes.ammo
        items.gear = this.actor.itemTypes.gear
        items.keywords = this.actor.itemTypes.keyword
        items.weapons = this.actor.itemTypes.weapon
        items.equipped = {
            weapons : items.weapons.filter(i => i.system.equipped),    
        }

        items.equipped.ammo = items.equipped.weapons.map(i => this.actor.items.get(i.ammo)).filter(i => !!i).filter((item, index, self) => self.findIndex(dup => dup.id == item.id) == index) //remove duplicate
        

        context.items = items;

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


      constructItemLists(context) {
        let items = {}

        items.ammo = this.actor.itemTypes.ammo
        items.gear = this.actor.itemTypes.gear
        items.keywords = this.actor.itemTypes.keyword
        items.weapons = this.actor.itemTypes.weapon
        items.equipped = {
            weapons : items.weapons.filter(i => i.system.equipped),    
        }

        items.equipped.ammo = items.equipped.weapons.map(i => this.actor.items.get(i.ammo)).filter(i => !!i).filter((item, index, self) => self.findIndex(dup => dup.id == item.id) == index) //remove duplicate
        

        context.items = items;

        this.constructInventory(context)
    }



}
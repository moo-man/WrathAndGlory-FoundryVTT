import WnGItemSheet from "../item"


export default class WeaponSheet extends WnGItemSheet {
  static type = "weapon"

  static DEFAULT_OPTIONS = {
    classes: [this.type],
    actions : {
      openUpgrade : this._onOpenUpgrade
    }
  }

  static PARTS = {
    header: { scrollable: [""], template: 'systems/wrath-and-glory/templates/item/item-header.hbs', classes: ["sheet-header"] },
    tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
    description: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/item-description.hbs` },
    stats: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/types/${this.type}.hbs` },
    effects: { scrollable: [""], template: 'systems/wrath-and-glory/templates/item/item-effects.hbs' },
  }

  async _prepareContext(options)
  {
    let context = await super._prepareContext(options);
    context.rangeType = (this.document.system.isMelee || this.document.system.category == "grenade-missile") ? "single" : "multi"
    context.upgradeEffects = this.document.system.upgradeItems.reduce((effects, upgrade) => effects.concat(upgrade.effects.contents), []) 
    context.ownedWeapons = this.document.actor?.itemTypes.weapon.filter(i => i.id != this.item.id).map(i => {
      return {
        id : i.id,
        name : i.name
      }
    });
    return context;
  }

  async _onDropItem(data, ev)
  {
    let item = await Item.implementation.fromDropData(data)

    if (item.type == "weaponUpgrade") 
    {
      let data = item.toObject();
      delete data._id;
      this.document.update({"system.upgrades" : this.document.system.upgrades.concat(data)});
    }
    else 
    {
      super._onDropItem(data, ev);
    }
  }

  static _onOpenUpgrade(ev, target)
  {
    let index = this._getIndex(ev);
    new Item.implementation(this.document.system.upgrades[index]).sheet.render({force : true, editable : false})
  }
}
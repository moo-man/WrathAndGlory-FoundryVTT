import WnGItemSheet from "../item"


export default class SpeciesSheet extends WnGItemSheet {
  static type = "species"

  static DEFAULT_OPTIONS = {
    classes: [this.type],
  }

  static PARTS = {
    header: { scrollable: [""], template: 'systems/wrath-and-glory/templates/item/item-header.hbs', classes: ["sheet-header"] },
    tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
    description: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/item-description.hbs` },
    stats: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/types/${this.type}.hbs` },
    effects: { scrollable: [""], template: 'systems/wrath-and-glory/templates/item/item-effects.hbs' },
  }

  async _onDropItem(data, ev)
  {
    let item = await Item.implementation.fromDropData(data)

    if (["ability", "talent"].includes(item.type))
    {
      this.document.update(this.document.system.abilities.add(item));
    }
    else 
    {
      super._onDropItem(data, ev);
    }
  }
  
}
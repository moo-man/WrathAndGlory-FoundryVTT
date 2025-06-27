import WnGItemSheet from "../item"


export default class ArchetypeSheet extends WnGItemSheet {
  static type = "archetype"

  static DEFAULT_OPTIONS = {
    classes: [this.type],
    defaultTab: "stats"
  }

  static PARTS = {
    header: { scrollable: [""], template: 'systems/wrath-and-glory/templates/item/item-header.hbs', classes: ["sheet-header"] },
    tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
    description: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/item-description.hbs` },
    stats: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/types/${this.type}.hbs` },
    effects: { scrollable: [""], template: 'systems/wrath-and-glory/templates/item/item-effects.hbs' },
  }

  _prepareTabs(options) {
    let tabs = super._prepareTabs(options);
    delete tabs.description;
    return tabs;
  }

  async _onDropItem(data, ev)
  {
    let item = await Item.implementation.fromDropData(data)

    if (item.type == "ability")
    {
      this.document.update(this.document.system.ability.set(item));
    }
    else if (item.type == "species")
    {
      this.document.update(this.document.system.species.set(item));
    }
    else if (item.type == "faction")
    {
      this.document.update(this.document.system.faction.set(item));
    }
    else if (item.type == "talent")
    {
      this.document.update(this.document.system.suggested.talents.add(item));
    }
    else if (item.type == "keyword")
    {
      this.document.update({"system.keywords" : this.document.system.keywords.concat(item.name)});
    }
    else 
    {
      super._onDropItem(data, ev);
    }
  }

}
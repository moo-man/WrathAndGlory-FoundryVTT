import WnGItemSheet from "../item"


export default class AscensionSheet extends WnGItemSheet {
  static type = "ascension"

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

}
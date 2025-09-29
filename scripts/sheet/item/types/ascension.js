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

  async _handleEnrichment() 
  {
      return foundry.utils.mergeObject(await super._handleEnrichment(), foundry.utils.expandObject({
          "system.benefits" : await foundry.applications.ux.TextEditor.enrichHTML(this.item.system.benefits, {async: true, secrets: this.item.isOwner, relativeTo: this.item})
      }));
  }

}
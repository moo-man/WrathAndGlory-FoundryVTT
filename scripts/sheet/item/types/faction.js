import WnGItemSheet from "../item"


export default class FactionSheet extends WnGItemSheet {
  static type = "faction"

  static DEFAULT_OPTIONS = {
    classes: [this.type],
    actions : {
      toggleChosen : this._onToggleChosen
    }
  }

  static PARTS = {
    header: { scrollable: [""], template: 'systems/wrath-and-glory/templates/item/item-header.hbs', classes: ["sheet-header"] },
    tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
    description: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/item-description.hbs` },
    stats: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/types/${this.type}.hbs` },
    effects: { scrollable: [""], template: 'systems/wrath-and-glory/templates/item/item-effects.hbs' },
  }

  static _onToggleChosen(ev, target)
  {
    let path = this._getPath(ev);
    let index = this._getIndex(ev);
    let list = foundry.utils.getProperty(this.document, path).concat([]);
    list[index].chosen = !list[index].chosen
    this.document.update({[path] : list});
  }

}
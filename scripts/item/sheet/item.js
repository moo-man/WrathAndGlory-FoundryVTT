export class WrathAndGloryItemSheet extends ItemSheet {
  activateListeners(html) {
    super.activateListeners(html);
    html.find("input").focusin(ev => this._onFocusIn(ev));
  }

  get template() {
    return `systems/wrath-and-glory/template/item/${this.item.type}.html`
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [
      {
        label: game.i18n.localize("BUTTON.POST_ITEM"),
        class: "item-post",
        icon: "fas fa-comment",
        onclick: (ev) => this.item.sendToChat(),
      }
    ].concat(buttons);
    return buttons;
  }

  getData() {
    const data = super.getData();
    data.data = data.data.data // project system data so that handlebars has the same name and value paths
    return data;
}


  _onFocusIn(event) {
    $(event.currentTarget).select();
  }
}
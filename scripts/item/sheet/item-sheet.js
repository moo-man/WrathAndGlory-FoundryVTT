import ItemTraits from "../../apps/item-traits.js";

export class WrathAndGloryItemSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["wrath-and-glory", "sheet", "item"],
      resizable: true,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }]
    });
  }

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

    data.conditions = CONFIG.statusEffects.map(i => {
      return {
          label : i.label,
          key : i.id,
          img : i.icon,
          existing : this.item.hasCondition(i.id)
      }
    })  

    data.rangeType = (this.item.isMelee || this.item.category == "grenade-missile") ? "single" : "multi"
    return data;
  }

  _onDrop(ev) {
    let dragData = JSON.parse(ev.dataTransfer.getData("text/plain"));
    let dropItem = game.items.get(dragData.id)
    if (this.item.type != "weapon" || !dropItem || dropItem.type != "weaponUpgrade")
      super._onDrop(ev)    
    else { // Valid to upgrade
      let upgrades = duplicate(this.item.upgrades)
      let upgrade = dropItem.toObject();
      upgrade._id = randomID()
      upgrades.push(upgrade)
      this.item.update({"data.upgrades" : upgrades})
      ui.notifications.notify("Upgrade applied to " + this.item.name)
    } 
  }

    // Prevent upgrades from stacking
  _getSubmitData(updateData = {}) {
    let data = super._getSubmitData(updateData);
    data = diffObject(flattenObject(this.item.toObject(false)), data)
    return data
  }


  _onFocusIn(event) {
    $(event.currentTarget).select();
  }

  activateListeners(html) {
    super.activateListeners(html)

    html.find(".item-traits").click(ev => {
      if (this.item.type == "weaponUpgrade")
      {
        let type = ev.currentTarget.classList.contains("add") ? "add" : "remove"
        new ItemTraits(this.item, {type}).render(true)
      }
      else 
        new ItemTraits(this.item).render(true)
    })

    html.find(".effect-create").click(ev => {
      if (this.item.isOwned)
        ui.notifications.error("Effects can only be added to world items or actors directly")

      this.object.createEmbeddedDocuments("ActiveEffect", [{ label: "New Effect", icon: "icons/svg/aura.svg" }])
    })

    html.find(".effect-edit").click(ev => {
      let id = $(ev.currentTarget).parents(".item").attr("data-item-id")
      this.object.effects.get(id).sheet.render(true)
    })

    html.find(".effect-delete").click(ev => {
      let id = $(ev.currentTarget).parents(".item").attr("data-item-id")
      this.object.deleteEmbeddedDocuments("ActiveEffect", [id])
    })

    html.find(".upgrade-delete").click(ev => {
      let index = parseInt($(ev.currentTarget).parents(".item").attr("data-index"))
      let upgrades = duplicate(this.item.upgrades)
      upgrades.splice(index, 1)
      return this.item.update({"data.upgrades" : upgrades})
    })

    html.find(".upgrade-name").click(ev => {
      let index = parseInt($(ev.currentTarget).parents(".item").attr("data-index"))
      this.item.Upgrades[index].sheet.render(true)
      ui.notifications.warn("Changes made to an upgrade will not be saved")
    }) 


    html.find(".condition-toggle").click(event => {
      let key = $(event.currentTarget).parents(".condition").attr("data-key")
      if (this.item.hasCondition(key))
          this.item.removeCondition(key)
      else
          this.item.addCondition(key)
    })

    html.find(".item-checkbox").click(ev => {
      let target = ev.currentTarget.dataset["target"]

      this.item.update({[target] : !getProperty(this.item.data, target)})
    })

  }
}
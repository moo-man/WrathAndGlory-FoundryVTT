import ArchetypeGeneric from "../../apps/archetype-generic.js";
import ArchetypeGroups from "../../apps/archetype-groups.js";
import ItemTraits from "../../apps/item-traits.js";
import { WrathAndGloryItem } from "../item.js";

export class WrathAndGloryItemSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["wrath-and-glory", "sheet", "item"],
      resizable: true,
      scrollY: [".sheet-body"],
      width: 650,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null}, {dragSelector: ".journal-list .journalentry", dropSelector: null}]
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

    if (this.item.journal)
    {
      buttons.unshift({
        label : game.i18n.localize("BUTTON.JOURNAL"),
        class: "item-journal",
        icon : "fas fa-book",
        onclick: async ev => this.item.showInJournal()
      })
    }

    return buttons;
  }

  async getData() {

    const data = await super.getData();

    // If this is a temp item with an archetype parent
    if (this.item.archetype) {
      let list = duplicate(getProperty(this.item.archetype.data, this.item.archetypeItemPath))
      let wargearObj = list[this.item.archetypeItemIndex];
      mergeObject(data.data, wargearObj.diff, { overwrite: true }) // Merge archetype diff with item data
      data.name = wargearObj.diff.name || data.item.name
    }
    else
      data.name = data.item.name

    data.system = data.data.system // project system data so that handlebars has the same name and value paths

    data.conditions = CONFIG.statusEffects.map(i => {
      return {
          label : i.label,
          key : i.id,
          img : i.icon,
          existing : this.item.hasCondition(i.id)
      }
    })  

    data.rangeType = (this.item.isMelee || this.item.category == "grenade-missile") ? "single" : "multi"

    if (this.item.type == "archetype")
    {
      let element = $(ArchetypeGroups.constructHTML(this.item, {parentheses: true, commas: true, draggable:false}))
      // Remove unnecessary outside parentheses
      let parentheses = Array.from(element.find(".parentheses"))
      parentheses[0].remove();
      parentheses[parentheses.length - 1].remove()
      data.wargearHTML = `<div class="group-wrapper">${element.html()}</div>`

      data.talents = this.item.suggested.talents.map(i => `<a class="archetype-item" data-id=${i.id}>${i.name}</a>`).join("<span class='connector'>,</span>")
    }
    else if (this.item.type == "species")
    {
      data.abilities = this.item.abilities.map(i => `<a class="species-item" data-id=${i.id}>${i.name}</a>`).join("<span class='connector'>,</span>")
    }

    data.enrichment = await this._handleEnrichment()
        
    return data;
}

async _handleEnrichment()
{
    let enrichment = {}
    enrichment["system.description"] = await TextEditor.enrichHTML(this.item.system.description, {async: true})

    return expandObject(enrichment)
}

  async _onDrop(ev) {
    let dragData = JSON.parse(ev.dataTransfer.getData("text/plain"));
    let dropDocument = await fromUuid(dragData.uuid)

    if (!dropDocument)
      return

    if (["archetype", "species", "faction"].includes(this.item.type) && ["JournalEntryPage", "JournalEntry"].includes(dropDocument.documentName))
    {
      return this.item.update({"system.journal" : dropDocument.uuid})
    }

    if (this.item.type === "weapon" && dropDocument.type === "weaponUpgrade")
    {
      let upgrades = duplicate(this.item.upgrades)
      let upgrade = dropDocument.toObject();
      upgrade._id = randomID()
      upgrades.push(upgrade)
      this.item.update({"system.upgrades" : upgrades})
      ui.notifications.notify("Upgrade applied to " + this.item.name)
    } 
    else if (this.item.type == "archetype" && dropDocument.documentName == "Item")
    {
      this.item.handleArchetypeItem(dropDocument);
    }
    else if (this.item.type == "species" && dropDocument.documentName == "Item")
    {
      this.item.handleSpeciesItem(dropDocument);
    }
    else
      super._onDrop(ev)
    // else if (dragData.type == "ActiveEffect")
    // {
    //   this.item.createEmbeddedDocuments("ActiveEffect", [dragData.data])
    // }
  }


  /** @inheritdoc */
  _onDragStart(event) {
    super._onDragStart(event)
    const li = event.currentTarget;

    // Create drag data
    const dragData = {
      itemId: this.item.id,
    };


    // Active Effect
    if ( li.dataset.effectId ) {
      const effect = this.item.effects.get(li.dataset.effectId);
      dragData.type = "ActiveEffect";
      dragData.data = effect.data;
    }

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }


  _updatePotency(index, path, value) {
    let potency = foundry.utils.deepClone(this.item.potency)
    if (Number.isNumeric(value) && typeof value != "boolean") // 
      value = Number(value)

    setProperty(potency[index], path, value)

    this.item.update({ "data.potency": potency })
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

    if (!this.options.editable) return

    html.find(".item-traits").click(ev => {
      if (this.item.type == "weaponUpgrade" || this.item.type == "ammo")
      {
        let type = ev.currentTarget.classList.contains("add") ? "add" : "remove"
        new ItemTraits(this.item, {type}).render(true)
      }
      else 
        new ItemTraits(this.item).render(true)
    })

    html.find(".effect-create").click(async ev => {
      if (this.item.isOwned)
        ui.notifications.error("Effects can only be added to world items or actors directly")
      let effectData = { label: this.item.name, icon: this.item.img }

        let html = await renderTemplate("systems/wrath-and-glory/template/apps/quick-effect.html", effectData)
        let dialog = new Dialog({
            title : "Quick Effect",
            content : html,
            buttons : {
                "create" : {
                    label : "Create",
                    callback : html => {
                        let mode = 2
                        let label = html.find(".label").val()
                        let key = html.find(".key").val()
                        let value = parseInt(html.find(".modifier").val())
                        effectData.label = label
                        effectData.changes = [{key, mode, value}]
                        this.object.createEmbeddedDocuments("ActiveEffect", [effectData])
                    }
                },
                "skip" : {
                    label : "Skip",
                    callback : () => this.object.createEmbeddedDocuments("ActiveEffect", [effectData]).then(effect => effect[0].sheet.render(true))
                }
            }
        })
        await dialog._render(true)
        dialog._element.find(".label").select()

    })

    html.find(".effect-edit").click(ev => {
      let id = $(ev.currentTarget).parents(".item").attr("data-effect-id")
      this.object.effects.get(id).sheet.render(true)
    })

    html.find(".effect-delete").click(ev => {
      let id = $(ev.currentTarget).parents(".item").attr("data-effect-id")
      this.object.deleteEmbeddedDocuments("ActiveEffect", [id])
    })

    html.find(".upgrade-delete").click(ev => {
      let index = parseInt($(ev.currentTarget).parents(".item").attr("data-index"))
      let upgrades = duplicate(this.item.upgrades)
      upgrades.splice(index, 1)
      return this.item.update({ "data.upgrades": upgrades })
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

    html.find(".wng-checkbox").click(ev => {
      let target = ev.currentTarget.dataset["target"]
      let index = ev.currentTarget.dataset["index"]
      
      if (target == "potency")
      {
        let index = parseInt($(ev.currentTarget).parents(".potency-fields").attr("data-index"))
        let path = ev.currentTarget.dataset["path"]
        this._updatePotency(index, path, !ev.currentTarget.classList.contains("checked"))
      }
      else if (Number.isNumeric(index)) // If value is inside an array
      {
        index = parseInt(index);
        let innerTarget = ev.currentTarget.dataset.innerTarget
        let array = duplicate(getProperty(this.item, target))
        array[index][innerTarget] = !array[index][innerTarget]
        this.item.update({[target] : array})
      }
      else
        this.item.update({ [target]: !getProperty(this.item, target) })
    })

    html.find(".add-potency").click(ev => {
      let potency = duplicate(this.item.potency)
      potency.push({
        "description": "",
        "cost": 1,
        "property": "",
        "initial": "",
        "value": "",
        "single" : false
      })
      this.item.update({ "data.potency": potency })
    })

    
    html.find(".add-background").click(ev => {
      let path = $(ev.currentTarget).parents(".backgrounds").attr("data-path")
      let array = duplicate(getProperty(this.item, path))

      if (path.includes("backgrounds"))
      {
        array.push({
          "name" : "",
          "description" : "",
          "effect" : ""
        })
      }
      else if (path.includes("objectives"))
      {
        array.push("")
      }
      
      this.item.update({[path] : array})
    })

    html.find(".potency-delete").click(ev => {
      let index = parseInt($(ev.currentTarget).parents(".potency-fields").attr("data-index"))
      this.item._deleteIndex(index, "data.potency")
    })

    html.find(".background-delete").click(ev => {
      let index = parseInt($(ev.currentTarget).parents(".background").attr("data-index"))
      let path = $(ev.currentTarget).parents(".backgrounds").attr("data-path")
      this.item._deleteIndex(index, path)
    })
    
    html.find(".potency-fields input").change(ev => {
      let index = parseInt($(ev.currentTarget).parents(".potency-fields").attr("data-index"))
      let path = ev.currentTarget.dataset.path
      this._updatePotency(index, path, ev.target.value)
    })

    html.find(".bg-name,.bg-description,.bg-effect").change(ev => {
      let index = parseInt($(ev.currentTarget).parents(".background").attr("data-index"))
      let path = $(ev.currentTarget).parents(".backgrounds").attr("data-path")
      let innerPath = ev.currentTarget.dataset.path;
      let value = ev.target.value

      let array = duplicate(getProperty(this.item, path))
      array[index][innerPath] = value;

      this.item.update({[path] : array})
    })

    html.find(".objective").change(ev => {
      let index = parseInt(ev.currentTarget.dataset.index)
      let value = ev.target.value

      let array = duplicate(this.item.objectives)
      array[index] = value;
      array = array.filter(i => i) // Objectives are deleted if blank (instead of X button like backgrounds)

      this.item.update({"data.objectives" : array})
    })



    html.find(".add-generic").click(async ev => {
      new ArchetypeGeneric({item: this.item}).render(true)
    })

    html.find(".reset").click(ev => {
      this.item.resetGroups();
    })

    html.find(".configure-groups").click(ev => {
      new ArchetypeGroups(this.item).render(true)
    })

    html.find(".archetype-item,.species-item,.archetype-faction,.archetype-species").mouseup(async ev => {
      let id = ev.currentTarget.dataset.id;
      if (ev.button == 0)
      {
        let item = game.items.get(id)
        if (!item)
          item = await fromUuid(id)
        
        if (!item)
        {
          throw new Error("Could not find Item with ID " + id)
        }

        item.sheet?.render(true, {editable: false})
      }
      else 
      {
       if (ev.currentTarget.classList.contains("archetype-ability")) 
       {
         this.item.update({"data.ability" : {id: "", name: ""}})
       }
       if (ev.currentTarget.classList.contains("archetype-faction")) 
       {
         this.item.update({"data.faction" : {id: "", name: ""}})
       }
       if (ev.currentTarget.classList.contains("archetype-species")) 
       {
         this.item.update({"data.species" : {id: "", name: ""}})
       }
       else if (this.item.type == "archetype") // Is archetype talent
       {
         let index = this.item.suggested.talents.findIndex(t => t.id == id)
         let array = duplicate(this.item.suggested.talents)
         array.splice(index, 1);
         this.item.update({"data.suggested.talents" : array})
       }
       else if (this.item.type == "species") // TODO Combine these if statements
       {
          let index = this.item.abilities.findIndex(t => t.id == id)
          let array = duplicate(this.item.abilities)
          array.splice(index, 1);
          this.item.update({"data.abilities" : array})
       }
      }
    })
    
    html.find(".wargear").mouseup(async ev => {
      let index = Number(ev.currentTarget.dataset.index)
      let array = duplicate(this.item.wargear);
      let obj = this.item.wargear[index];

      if (obj) {
        if (ev.button == 0)
        {
          if (obj.type == "generic")
          new ArchetypeGeneric({item: this.item, index}).render(true);
          else
          {
            let item = game.items.get(obj.id)
            if (!item)
              item = await fromUuid(obj.id)

            if (!item) 
              throw new Error("Could not find Item with ID " + obj.id)

            new WrathAndGloryItem(item.toObject(), { archetype: { item: this.item, index, path: "data.wargear" } }).sheet.render(true)

          }
        }
        else {
          new Dialog({
            title: "Delete Item?",
            content: "Do you want to remove this item from the Archetype? This will reset the groupings.",
            buttons: {
              yes: {
                label: "Yes",
                callback: async () => {
                  array.splice(index, 1)
                  await this.item.update({ "data.wargear" : array })
                  this.item.resetGroups();
                }
              },
              no: {
                label: "No",
                callback: () => { }
              }
            }
          }).render(true)
        }
      }
    })

  }

}
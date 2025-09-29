import ItemTraits from "../../apps/item-traits"
import { PostedItemMessageModel } from "../../model/message/item"


export default class WnGItemSheet extends WarhammerItemSheetV2
{
    static type=""
  
    static DEFAULT_OPTIONS = {
      classes: ["wrath-and-glory"],
      defaultTab : "description",
      position : {
        width: 700,
        height: 550,
      },
      window : {
        controls : [
          {
            icon : 'fa-solid fa-comment',
            label : "Post to Chat",
            action : "postToChat"
          }
        ]
      },
      actions : {
        postToChat : function() {this.item.postItem()},
        editTraits : this._onEditTraits,
        toggleCondition: this._onToggleCondition
        
      }
    }

    static TABS = {
        description: {
          id: "description",
          group: "primary",
          label: "TAB.DESCRIPTION",
        },
        stats: {
          id: "stats",
          group: "primary",
          label: "TAB.STATS",
        },
        effects: {
          id: "effects",
          group: "primary",
          label: "TAB.EFFECTS",
        }
      }

      
      static PARTS = {
        header : {scrollable: [""], template : 'systems/wrath-and-glory/templates/item/item-header.hbs', classes: ["sheet-header"] },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        description: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/types/item-description.hbs` },
        stats: { scrollable: [""], template: `systems/wrath-and-glory/templates/item/types/${this.type}.hbs` },
        effects: { scrollable: [""], template: 'systems/wrath-and-glory/templates/item/item-effects.hbs' },
      }

    _getContextMenuOptions()
  { 
    let getParent = this._getParent.bind(this);
    return [
      {
        name: "Edit",
        icon: '<i class="fas fa-edit"></i>',
        condition: li => !!li.dataset.uuid || getParent(li, "[data-uuid]"),
        callback: async li => {
          let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid;
          const document = await fromUuid(uuid);
          document.sheet.render(true);
        }
      },
      {
        name: "Remove",
        icon: '<i class="fas fa-times"></i>',
        condition: li => !!li.dataset.uuid || getParent(li, "[data-uuid]"),
        callback: async li => 
        {
          let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid;
          const document = await fromUuid(uuid);
          document.delete();
        }
      },
      {
        name: "Duplicate",
        icon: '<i class="fa-solid fa-copy"></i>',
        condition: li => !!li.dataset.uuid || getParent(li, "[data-uuid]"),
        callback: async li => 
        {
            let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid;
            const document = await fromUuid(uuid);
            this.item.createEmbeddedDocuments("ActiveEffect", [document.toObject()]);
        }
      },
    ];
  }
    

    async _onDropItem(data, ev)
    {
    }


    async _prepareContext(options) 
    {
        let context = await super._prepareContext(options);
        context.conditions = this.formatConditions();
        return context;
    }

    
    formatConditions() 
    {
        try 
        {
            let conditions = foundry.utils.duplicate(CONFIG.statusEffects).map(e => new CONFIG.ActiveEffect.documentClass(e));
            let currentConditions = this.item.effects.filter(e => e.isCondition);
      
            for (let condition of conditions) 
            {
                let owned = currentConditions.find(e => e.conditionId == condition.conditionId);
                if (owned) 
                {
                    condition.existing = true;
                }
            }
            return conditions;
        }
        catch (e)
        {
            ui.notifications.error("Error Adding Condition Data: " + e);
        }
    }


    async _handleEnrichment() 
    {
        return foundry.utils.expandObject({
            "system.description" : await foundry.applications.ux.TextEditor.enrichHTML(this.item.system.description, {async: true, secrets: this.item.isOwner, relativeTo: this.item})
        });
    }


    static _onEditTraits(ev, target) 
    {
      if (this.item.type == "weaponUpgrade" || this.item.type == "ammo")
        {
          let type = target.dataset.type;
          new ItemTraits(this.item, {type}).render(true)
        }
        else 
          new ItemTraits(this.item).render(true)
    }

          
    static _onToggleCondition(ev, target)
    {
        let key = target.dataset.condition;
        if (this.document.hasCondition(key))
            this.document.removeCondition(key)
        else
            this.document.addCondition(key)
    }
    
}
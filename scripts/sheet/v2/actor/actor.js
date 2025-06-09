export default class WnGActorSheet extends WarhammerActorSheetV2
{
    static DEFAULT_OPTIONS = {
        classes: ["wrath-and-glory"],
        window : {
          controls : [
            {
              icon : 'fa-solid fa-gear',
              label : "Actor Settings",
              action : "configureActor"
            }
          ],
        },
        position: {
            height: 800,
            height: 720
        },
        actions : {
            rollTest : this._onRollTest,
            toggleSummary : this._toggleSummary,
            configureActor : this._onConfigureActor,
        },
        defaultTab : "main"
      }   
      
      async _handleEnrichment()
      {
          let enrichment = {}
          enrichment["system.notes"] = await TextEditor.enrichHTML(this.actor.system.notes, {async: true, secrets: this.actor.isOwner, relativeTo: this.actor})
  
          for(let item of this.actor.items.contents)
          {
              enrichment[item.id] = await TextEditor.enrichHTML(item.description);
          }
  
          return expandObject(enrichment)
      }

      async _prepareContext(options)
      {
          let context = await super._prepareContext(options);
          // context.items.equipped = this.getEquippedItems();
          return context;
      }

      _addEventListeners()
      {
          super._addEventListeners();
  
          this.element.querySelectorAll(".rollable").forEach(element => {
              element.addEventListener("mouseenter", ev => {
              let img = ev.target.matches("img") ? ev.target : ev.target.querySelector("img") ;
              if (img)
              {
                  this._icon = img.src;
                  img.src = "systems/impmal/assets/icons/d10.webp";
              }
              })
              element.addEventListener("mouseleave", ev => {
              let img = ev.target.matches("img") ? ev.target : ev.target.querySelector("img") ;
              if (img)
              {
                  img.src = this._icon;
              }
              })
          });
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
            condition: li => {
              let uuid = li.dataset.uuid || getParent(li, "[data-uuid]").dataset.uuid
              if (uuid)
              {
                let parsed = foundry.utils.parseUuid(uuid);
                if (parsed.type == "ActiveEffect")
                {
                  return parsed.primaryId == this.document.id; // If an effect's parent is not this document, don't show the delete option
                }
                else if (parsed.type)
                {
                  return true;
                }
                return false;
              }
              else return false;
            },
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
                  this.actor.createEmbeddedDocuments("ActiveEffect", [document.toObject()]);
              }
            },
        ];
      }
  
      /**
       * Prevent effects from stacking up each form submission
     * @override
     */
      async _processSubmitData(event, form, submitData) {
          let diffData = foundry.utils.diffObject(this.document.toObject(false), submitData)
          await this.document.update(diffData);
        }
  


      static _onConfigureActor(ev) 
      {
          new ActorConfigForm(this.actor).render(true);
      }
  

      static _onRollTest(ev, target)
      {
          let type = target.dataset.type;  // characteristic, skill, etc.
          let key = this._getKey(ev);                   // Non items, such as characteristic keys, or skill keys
          let itemId = this._getId(ev);                   // Item ids, if using skill items or weapons
  
          switch(type)
          {
          case "attribute":
              return this.actor.setupAttributeTest(key);
          case "skill":
              return this.actor.setupSkillTest({itemId, key});
          case "weapon":
              return this.actor.setupWeaponTest(itemId);
          case "power":
              return this.actor.setupPowerTest(itemId);
          case "trait":
              return this.actor.setupTraitTest(itemId);
          case "item":
              return this.actor.setupTestFromItem(this.actor.items.get(itemId).uuid);
          }
      }
  
  
}

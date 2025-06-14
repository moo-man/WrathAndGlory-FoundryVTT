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
            toggleCondition: this._onToggleCondition,
            toggleTrait : this._onToggleTrait
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
          return context;
      }
      
      
      _attributeAndSkillTooltips(context) {

        for (let attribute of Object.values(context.system.attributes)) {
            attribute.tooltip = `Rating: ${attribute.rating} | Advance Cost: ${game.wng.utility.getAttributeCostIncrement(attribute.rating + 1)} | Current XP: ${this.actor.experience.current}`
        }

        for (let skill of Object.values(context.system.skills)) {
            skill.tooltip = `Rating: ${skill.rating} | Advance Cost: ${game.wng.utility.getSkillCostIncrement(skill.rating + 1)} | Current XP: ${this.actor.experience.current}`
        }
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
                  img.src = "systems/wrath-and-glory/assets/icons/dice.svg";
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
  
      static async _toggleSummary(ev) 
      {
          ev.preventDefault();
          let document = this._getDocument(ev);
          this._toggleDropdown(ev, document.system.description);
      }
  
      static async _onToggleTrait(ev)
      {
        let item = this._getDocument(ev);
        let index = this._getIndex(ev);
        let trait = item.system.traits.list[index];
        let description = trait.description || game.wng.config.traitDescriptions[trait.name];

        this._toggleDropdown(ev, await TextEditor.enrichHTML(description, {async: true, relativeTo: this.document, secrets: this.document.isOwner}));
      }

      static async _onRollTest(ev, target)
      {
          let type = target.dataset.type; 
          let key = target.dataset.key; 
          let itemId = this._getId(ev); 
  
          if (type == "conviction")
          {
            type = await new foundry.applications.api.DialogV2.wait({
              window: {title: "Conviction Roll"},
              buttons: [
                  {
                      key  : "corruption",
                      label: "Corruption",
                  },
                  {
                    key : "mutation",
                    label : "Mutation"
                  }
                ]
            })
          }

          if (type == "resolve")
            {
              type = await new foundry.applications.api.DialogV2.wait({
                window: {title: "Resolve Roll"},
                buttons: [
                    {
                        key  : "fear",
                        label: "Fear",
                    },
                    {
                      key : "terror",
                      label : "Terror"
                    }
                  ]
              })
            }

          switch(type)
          {
          case "attribute":
              return this.actor.setupAttributeTest(key);
          case "skill":
              return this.actor.setupSkillTest(key);
          case "determination":
          case "stealth":
          case "corruption":
          case "mutation":
          case "fear":
          case "terror":
          case "influence":
              return this.actor.setupGenericTest(type);
          case "weapon":
              return this.actor.setupWeaponTest(itemId);
          case "psychicPower":
              return this.actor.setupPowerTest(itemId);
          case "ability":
              return this.actor.setupAbilityRoll(itemId);
          }
      }

      
    static _onToggleCondition(ev, target)
    {
        let key = target.dataset.condition;
        if (this.actor.hasCondition(key))
            this.actor.removeCondition(key)
        else
            this.actor.addCondition(key)
    }
  
  
}

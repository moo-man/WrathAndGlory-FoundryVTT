import { RollDialog } from "./base-dialog";

export class CommonDialog extends RollDialog {

  static DEFAULT_OPTIONS = {
    position: {
        width: 600
    }
  };
  
  static PARTS = {
    common : {
        template : "systems/wrath-and-glory/templates/dialog/common-roll.hbs",
        fields: true
    },
    determination : {
      template : "systems/wrath-and-glory/templates/dialog/determination-roll.hbs",
      fields: true
    },
    mode : {
        template : "modules/warhammer-lib/templates/apps/dialog/dialog-mode.hbs",
        fields: true
    },
    modifiers : {
        template : "modules/warhammer-lib/templates/partials/dialog-modifiers.hbs",
        modifiers: true
    },
    footer : {
        template : "templates/generic/form-footer.hbs"
    }
};


    get skill() 
    {
      return this.data.skill;
    }

    get attribute() 
    {
      return this.data.attribute;
    }

    get title()
    {
      return this.context.title;
    }

    static async setupData({attribute, skill, pool, wrath, dn}, actor, context={}, options={})
    {
        let dialogData = await super.setupData({pool, wrath, dn}, actor, context, options)
        dialogData.data.attribute = attribute || game.wng.config.skillAttribute[skill];
        dialogData.data.skill = skill;

        dialogData.context.title = this._constructTitle(dialogData);
        dialogData.data.item = context.item;
        
        return dialogData
    }

    static _constructTitle({data, fields, context})
    {
      let title = context.title
      if (!title && data.skill)
      {
        title = context.title || `${game.wng.config.skills[data.skill]} Test`
      }
      else if (!title && data.attribute)
      {
        title = context.title || `${game.wng.config.attributes[data.attribute]} Test`;
      }
      title += context.appendTitle || "";
      return title;
    }

    computeFields()
    {
      super.computeFields();
      this.fields.wrath += this.actor.itemTypes.traumaticInjury.length
      this.tooltips.add("wrath", this.actor.itemTypes.traumaticInjury.length, "Traumatic Injuries")
    }

    computeInitialFields()
    {
      super.computeInitialFields();
      if (this.data.skill || this.data.attribute)
      {
        let pool = this.data.skill ? this.actor.system.skills[this.data.skill].total : this.actor.system.attributes[this.data.attribute].total
        this.fields.pool = pool
        this.tooltips.set("pool", pool, game.wng.config.skills[this.data.skill] || game.wng.config.attributes[this.data.attribute])
      }
      else if (this.context.initialTooltip)
      {
        this.tooltips.set("pool", this.initialFields.pool, this.context.initialTooltip)
        // this.options.initialTooltip = game.wng.config.skills[this.data.skill] || game.wng.config.attributes[this.data.attribute]
      }

      if (this.context.corruption)
      {
        let level = game.wng.config.corruptionLevels[this.actor.corruptionLevel]
        this.difficulty += level.dn;
        this.tooltips.add("difficulty", level.dn, "Corruption Level")
      }
    }

    _configureRenderParts(options) 
    {
        let parts = super._configureRenderParts(options);
        if (!this.context.determination)
        {
            delete parts.determination;
        }
        return parts;
    }
  
    _defaultFields() 
    {
        return mergeObject({
          pool : 1,
          wrath : 1,
          difficulty : 3,
        }, super._defaultFields());
    }
  }
  
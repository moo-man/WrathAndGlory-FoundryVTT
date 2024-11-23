import { RollDialog } from "./base-dialog";

export class CommonDialog extends RollDialog {

    get skill() 
    {
      return this.data.skill;
    }

    get attribute() 
    {
      return this.data.attribute;
    }

    static async setupData({attribute, skill}, actor, options={})
    {
        let dialogData = await super.setupData({}, actor, options)
        dialogData.data.attribute = attribute || game.wng.config.skillAttribute[skill];
        dialogData.data.skill = skill;
        dialogData.options.title = this._constructTitle(dialogData);

        return dialogData
    }

    static _constructTitle({data, fields, options})
    {
      let title = options.title
      if (!title && data.skill)
      {
        title = options.title || `${game.wng.config.skills[data.skill]} Test`
      }
      else if (!title && data.attribute)
      {
        title = options.title || `${game.wng.config.attributes[data.attribute]} Test`;
      }
      title += options.appendTitle || "";
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
      else if (this.options.initialTooltip)
      {
        this.tooltips.set("pool", this.initialFields.pool, this.options.initialTooltip)
        // this.options.initialTooltip = game.wng.config.skills[this.data.skill] || game.wng.config.attributes[this.data.attribute]
      }

      if (this.options.corruption)
      {
        let level = game.wng.config.corruptionLevels[this.actor.corruptionLevel]
        this.difficulty += level.dn;
        this.tooltips.add("difficulty", level.dn, "Corruption Level")
      }
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
  
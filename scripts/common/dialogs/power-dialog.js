import { AttackDialog } from "./attack-dialog.js";

export class PowerDialog extends AttackDialog {

  static PARTS = {
    common : {
        template : "systems/wrath-and-glory/templates/dialog/common-roll.hbs",
        fields: true
    },
    attack : {
      template : "systems/wrath-and-glory/templates/dialog/attack-roll.hbs",
      fields: true
    },
    power : {
      template : "systems/wrath-and-glory/templates/dialog/power-roll.hbs",
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

  get power() 
  {
    return this.data.power;
  }

  static async setupData(power, actor, context={})
  {
      if (typeof power == "string")
      {
        power = actor.items.get(power) || await fromUuid(power)
      }

      
      let skill = "psychicMastery"
      
      let dialogData = await super.setupData({skill}, actor, context)
      
      dialogData.data.levels = {
        bound : game.i18n.localize("PSYCHIC_POWER.BOUND"),
        unbound : game.i18n.localize("PSYCHIC_POWER.UNBOUND"),
        transcendent : game.i18n.localize("PSYCHIC_POWER.TRANSCENDENT")
      }

      dialogData.data.power = power;
      dialogData.data.item = power;
      
      dialogData.data.scripts = dialogData.data.scripts.concat(power?.getScripts("dialog"));
      foundry.utils.setProperty(dialogData, "fields.ed.dice",  power.system.damage.ed.dice);
      foundry.utils.setProperty(dialogData, "fields.ap.dice",  power.system.damage.ap.dice);

      context.title = `${power.name} Test`
      
      if (power.system.dn.includes("@") && dialogData.data.targets.length == 0) 
      {
        ui.notifications.warn(game.i18n.localize("DIALOG.TARGET_DEFENSE_WARNING"))
      }
      return dialogData;
  }

  computeFields()
  {
    super.computeFields();
    this.tooltips.start(this)

    if (this.fields.level == "unbound")
    {
      this.fields.wrath += 1
      this.fields.pool += 1
    }
    if (this.fields.level == "transcendent")
    {
        this.fields.wrath += 2
        this.fields.pool += 2
    }
    this.tooltips.finish(this, this.data.levels[this.fields.level])

    this.tooltips.start(this)
    if (this.context.multi)
    {
      this.fields.difficulty += (this.context.multi - 1) * 2;
    }
    this.tooltips.finish(this, `Multi-Attack (${this.context.multi} Targets)`)

    let power = this.power;
  
    this.tooltips.start(this)
    this.fields.damage += power.system.damage.base + power.system.damage.bonus
    this.fields.ed.value += power.system.damage.ed.base + power.system.damage.ed.bonus
    this.fields.ap.value += power.system.damage.ap.base + power.system.damage.ap.bonus
    this.tooltips.finish(this, "Power")
  
  }

  
    /**
     * Transforms dialog data and fields into a options into data that will be given to some test object for evaluation
     * @returns {object} Formatted submission data
     */
    _getSubmissionData()
    {
      let submitData = super._getSubmissionData();
      if (this.fields.level == "unbound" && !this.actor.hasCondition("unbound"))
      {
        this.actor.addCondition("unbound")
      }
      if (this.fields.level == "transcendent" && !this.actor.hasCondition("transcendent"))
      {
        this.actor.removeCondition("unbound")
        this.actor.addCondition("transcendent")
      }
      return submitData;
    }

  computeInitialFields()
  {
    super.computeInitialFields();
    if(this.power.system.dn)
    {
      if (Number.isNumeric(this.power.system.dn))
      {
        this.fields.difficulty = parseInt(this.power.system.dn)
      }
      else if (this.power.system.dn.includes("@") && this.target)
      {
        this.fields.difficulty = (0, eval)(Roll.replaceFormulaData(this.power.system.dn, this.target.getRollData()))
      }
      this.tooltips.set("difficulty", this.fields.difficulty, this.power.name + " DN");
    }
    else 
    {
      this.fields.difficulty = null;
    }
  }

  _defaultFields() 
  {
      return mergeObject({
          level : "bound",
      }, super._defaultFields());
  }
}
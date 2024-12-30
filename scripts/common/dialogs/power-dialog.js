import { AttackDialog } from "./attack-dialog.js";

export class PowerDialog extends AttackDialog {

  subTemplate=["systems/wrath-and-glory/template/dialog/attack-roll.hbs", "systems/wrath-and-glory/template/dialog/power-roll.hbs"]


  get power() 
  {
    return this.data.power;
  }

  static async setupData(power, actor, options={})
  {
      if (typeof power == "string")
      {
        power = actor.items.get(power) || await fromUuid(power)
      }

      
      let skill = "psychicMastery"
      let attribute = power.skill.attribute
      
      let dialogData = await super.setupData({skill, attribute}, actor, options)
      
      dialogData.data.levels = {
        bound : game.i18n.localize("PSYCHIC_POWER.BOUND"),
        unbound : game.i18n.localize("PSYCHIC_POWER.UNBOUND"),
        transcendent : game.i18n.localize("PSYCHIC_POWER.TRANSCENDENT")
      }

      dialogData.data.power = power;
      dialogData.data.item = power;
      
      dialogData.data.scripts = dialogData.data.scripts.concat(power?.getScripts("dialog"));
      
      options.title = `${power.name} Test`
      
      if (power.system.DN == "?") 
      {
        ui.notifications.warn(game.i18n.localize("DIALOG.TARGET_DEFENSE_WARNING"))
      }
      return dialogData;
  }

  computeFields()
  {
    super.computeFields();
    if (this.fields.level == "unbound")
    {
      this.fields.wrath += 1
      this.tooltips.add("wrath", 1, this.data.levels[this.fields.level])
    }
    if (this.fields.level == "transcendent")
    {
        this.fields.wrath += 2
        this.tooltips.add("wrath", 2, this.data.levels[this.fields.level])
    }

    let power = this.power;
  
    this.tooltips.start(this)
    this.fields.damage += power.system.damage.base + power.system.damage.bonus
    this.fields.ed.value += power.system.damage.ed.base + power.system.damage.ed.bonus
    this.fields.ap.value += power.system.damage.ap.base + power.system.damage.ap.bonus
    this.fields.ed.dice += power.system.damage.ed.dice
    this.fields.ap.dice += power.system.damage.ap.dice
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
    let DN = this.power.system.DN;
    if(!isNaN(DN))
    {
      this.fields.difficulty = this.power.system.DN
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
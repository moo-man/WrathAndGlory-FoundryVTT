import { AttackDialog } from "./attack-dialog.js";

export class PowerDialog extends AttackDialog {
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
      
      dialogData.data.power = power;
      dialogData.data.scripts = dialogData.data.scripts.concat(power?.getScripts("dialog"));
      
      options.title = `${power.name} Test`
      
      if (power.system.DN == "?") 
      {
        ui.notifications.warn(game.i18n.localize("DIALOG.TARGET_DEFENSE_WARNING"))
      }
      return dialogData;
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
}
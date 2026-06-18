import { AttackDialog } from "./attack-dialog.js";

export class AbilityDialog extends AttackDialog {

  get ability() 
  {
    return this.data.ability;
  }

  static PARTS = {
    common : {
        template : "systems/wrath-and-glory/templates/dialog/common-roll.hbs",
        fields: true
    },
    attack : {
      template : "systems/wrath-and-glory/templates/dialog/ability-roll.hbs",
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

async _prepareContext(options)
{
  let context = await super._prepareContext(options);
  return context;
}

  static async setupData(ability, actor, context={}, options)
  {
      if (typeof ability == "string")
      {
        ability = actor.items.get(ability) || await fromUuid(ability);
      }

      let skill = ability.getSkillFor();
      let attribute = ability.getSkillFor(actor).attribute;

      let dialogData = await super.setupData({skill, attribute}, actor, context, options);

      dialogData.data.item = ability;
      dialogData.data.ability = ability;
      dialogData.data.scripts = dialogData.data.scripts.concat(ability?.getScripts("dialog"));
      foundry.utils.setProperty(dialogData, "fields.ed.dice",  ability.system.damage.ed.dice);
      foundry.utils.setProperty(dialogData, "fields.ap.dice",  ability.system.damage.ap.dice);

      context.title = `${ability.name} Test`

      return dialogData;
  }

  computeFields()
  {
    super.computeFields();
    let ability = this.ability;

    this.tooltips.start(this)
    this.fields.pool += (ability.attack?.base || 0)  + (ability.attack?.bonus || 0)
    this.fields.damage += ability.system.damage.base + ability.system.damage.bonus + (ability.system.damage.rank * this.actor.system.advances?.rank || 0)
    this.fields.ed.value += ability.system.damage.ed.base + ability.system.damage.ed.bonus + (ability.system.damage.ed.rank * this.actor.system.advances?.rank || 0)
    this.fields.ap.value += ability.system.damage.ap.base + ability.system.damage.ap.bonus + (ability.system.damage.ap.rank * this.actor.system.advances?.rank || 0)

    this.tooltips.finish(this, "Ability")
  }

  computeInitialFields()
  {
    super.computeInitialFields();
    this.computeTargets();
  }


  computeTargets()
  {
    if (this.ability.system.traits.has("blast"))
    {
      this.fields.difficulty = 3
      this.tooltips.set("difficulty", 3, "Blast", true)
    }
  }
}

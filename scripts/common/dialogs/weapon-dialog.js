import { AttackDialog } from "./attack-dialog.js";

export class WeaponDialog extends AttackDialog {

  get weapon() 
  {
    return this.data.weapon;
  }

  static PARTS = {
    common : {
        template : "systems/wrath-and-glory/templates/dialog/common-roll.hbs",
        fields: true
    },
    attack : {
      template : "systems/wrath-and-glory/templates/dialog/attack-roll.hbs",
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
  context.calledShotSizes = {
    "tiny" : "SIZE.TINY",
    "small" : "SIZE.SMALL",
    "medium" : "SIZE.MEDIUM",
  }

  context.salvoOptions = {
    "fullAuto" : "DIALOG.FULL_AUTO",
    "sprayShot" : "DIALOG.SPRAY_SHOT",
    "sprayShotMob" : "DIALOG.SPRAY_SHOT_MOB",
  }
  return context;
}

  static async setupData(weapon, actor, context={}, options)
  {
      if (typeof weapon == "string")
      {
        weapon = actor.items.get(weapon) || await fromUuid(weapon)
      }


      if (weapon.ammo.document && weapon.ammo.document.system.quantity == 0)
      {
        ui.notifications.error("Out of ammo!");
        throw Error("Out of ammo!");
      }


      // If they didn't reload, don't proceed with roll
      if ((await weapon.system.promptReload()) == false)
      {
        return;
      }

      context.combi = weapon.system.combi?.document ? await Dialog.confirm({title : "Combi-Weapons", content : "Fire both Combi-Weapons?"}) : false

      let skill = weapon.isMelee ? "weaponSkill" : "ballisticSkill"
      let attribute = weapon.getSkillFor(actor).attribute

      let dialogData = await super.setupData({skill, attribute}, actor, context, options)

      dialogData.data.item = weapon;
      dialogData.data.weapon = weapon;
      dialogData.data.scripts = dialogData.data.scripts.concat(weapon?.getScripts("dialog"));
      foundry.utils.setProperty(dialogData, "fields.ed.dice",  weapon.system.damage.ed.dice);
      foundry.utils.setProperty(dialogData, "fields.ap.dice",  weapon.system.damage.ap.dice);

      if (dialogData.data.targets[0])
      {
        let token = actor.getActiveTokens()[0]?.document
        let target = dialogData.data.targets[0];
        if (target && token)
        {
          dialogData.fields.distance = canvas.grid.measureDistances([{ ray: new Ray({ x: token.x, y: token.y }, { x: target.x, y: target.y }) }], { gridSpaces: true })[0]
        }
      }


      context.title = `${weapon.name} Test`

      return dialogData;
  }

  computeFields()
  {
    super.computeFields();
    let weapon = this.weapon;

    this.tooltips.start(this)
    this.fields.pool += (weapon.attack?.base || 0)  + (weapon.attack?.bonus || 0)
    this.fields.damage += weapon.system.damage.base + weapon.system.damage.bonus + (weapon.system.damage.rank * this.actor.system.advances?.rank || 0)
    this.fields.ed.value += weapon.system.damage.ed.base + weapon.system.damage.ed.bonus + (weapon.system.damage.ed.rank * this.actor.system.advances?.rank || 0)
    this.fields.ap.value += weapon.system.damage.ap.base + weapon.system.damage.ap.bonus + (weapon.system.damage.ap.rank * this.actor.system.advances?.rank || 0)

    if (weapon.isMelee) {
      this.fields.damage += this.actor.system.attributes[weapon.system.damage.attribute || "strength"].total
    }
    this.tooltips.finish(this, "Weapon")


    // Aiming
    if (this.fields.aim)
    {
      this.fields.pool++;
      this.tooltips.add("pool", 1, game.i18n.localize("WEAPON.AIM"))
    }

    // Called Shots
    if (this.fields.calledShot.size)
    {
      this.tooltips.start(this)
      let value = 0
      switch(this.fields.calledShot.size)
      {
        case "tiny" :
          value = 3;
          break;
        case "small" : 
          value = 2;
          break;
        case "medium" : 
          value = 1;
          break;
      }
      this.fields.difficulty += value;
      this.fields.ed.value += value;
      this.tooltips.finish(this, game.i18n.localize("WEAPON.CALLED_SHOT"))
    }

    // Range
    this.tooltips.start(this)
    if (this.fields.range == "short")
    {
      this.fields.pool += 1
      this.tooltips.finish(this, "Short Range")
    }
    else if (this.fields.range == "long")
    {
      this.fields.difficulty += 2
      this.tooltips.finish(this, "Long Range")
    }
    else 
    {
      this.tooltips.finish();
    }

    // Charging
    if (this.fields.charging)
    {
      this.fields.pool++;
      this.tooltips.add("pool", 1, game.i18n.localize("WEAPON.CHARGING"))
    }

    // Mob
    if (this.actor.isMob)
    {
      this.fields.pool += Math.ceil(this.actor.mob / 2)
      this.tooltips.add("pool", Math.ceil(this.actor.mob / 2), "Mob")
    }

    // Salvo - Full Auto 
    if (this.fields.salvo == "fullAuto")
    {
      this.tooltips.start(this)
      this.fields.pool += this.weapon.system.salvo;
      if (weapon.system.twinned && weapon.system.salvo >= 2)
      {
        this.fields.pool += this.weapon.system.salvo;
      }
      this.tooltips.finish(this, "Salvo - Full Auto")
    }

    else if (this.fields.salvo == "sprayShot" && this.context.multi > 0)
    {
      this.tooltips.start(this)

      let multiPenalty = (this.context.multi - 1) * 2;
      let salvo = this.weapon.system.salvo;
      if (weapon.system.twinned && weapon.system.salvo >= 2)
      {
        salvo *= 2;
      }
      this.fields.difficulty -= Math.min((multiPenalty || 0), (salvo || 0));

      this.tooltips.finish(this, "Salvo - Spray Shot")
    }

    // Twinned
    if (weapon.system.twinned)
    {
      this.tooltips.start(this)

      if (!isNaN(weapon.system.salvo) && weapon.system.salvo <= 1)
      {
        this.fields.ed.value += weapon.system.damage.ed.base + weapon.system.damage.ed.bonus + (weapon.system.damage.ed.rank * this.actor.system.advances?.rank || 0);
      }
      this.tooltips.finish(this, "Twinned")
    }
  }

  computeInitialFields()
  {
    super.computeInitialFields();
    this.computeRange();
    this.computeTargets();
  }


  computeTargets()
  {
    if (this.data.targets[0])
    {
          let target = this.data.targets[0]

          if (target && target.actor)
          {
            this.fields.difficulty = target.actor.combat.defence.total
            this.tooltips.set("difficulty", target.actor.combat.defence.total, "Target Defence")

            
            this.tooltips.start(this)
            if (this.context.multi)
            {
              this.fields.difficulty += (this.context.multi - 1) * 2;
            }
            this.tooltips.finish(this, `Multi-Attack (${this.context.multi} Targets)`)


            this.tooltips.start(this)
            if (target.actor.system.combat.size == "large")
            {
                this.fields.pool += 1;
            }
            else if (target.actor.system.combat.size == "huge")
            {
                this.fields.pool += 2;
            }
            else if (target.actor.system.combat.size == "gargantuan")
            {
                this.fields.pool += 3;
            }
            this.tooltips.finish(this, "Target Size") 
        }
    }

    if (this.weapon.system.traits.has("blast"))
    {
      this.fields.difficulty = 3
      this.tooltips.set("difficulty", 3, "Blast", true)
    }
  }

  computeRange()
  {
    let range
    let weapon = this.weapon;
    if (this.fields.distance && weapon.isRanged) {

      if (this.fields.distance <= weapon.range.short) 
      {
        range = "short"
      }

      else if (this.fields.distance > weapon.range.short && this.fields.distance <= weapon.range.medium) 
      {
        range = "medium"
      }

      else if (this.fields.distance > weapon.range.medium && this.fields.distance <= weapon.range.long) 
      {
        range = "long"
      }

      else 
      {
        range = ""
        if (this.fields.distance) {
          ui.notifications.warn(game.i18n.localize("DIALOG.OUT_OF_RANGE"))
        }
      }
    }

    if (range)
    {
      this.fields.range = range;
    }
  }

  _defaultFields() 
  {
      return mergeObject({
          distance : null,
          range : null,
          aim : false,
          calledShot : {
            size : "",
            label : ""
          }
      }, super._defaultFields());
  }
}

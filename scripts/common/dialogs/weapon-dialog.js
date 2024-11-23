import { AttackDialog } from "./attack-dialog.js";

export class WeaponDialog extends AttackDialog {


  get weapon() 
  {
    return this.data.weapon;
  }

  static async setupData(weapon, actor, options={})
  {
      if (typeof weapon == "string")
      {
        weapon = actor.items.get(weapon) || await fromUuid(weapon)
      }

      options.combi = weapon.system.combi.document ? await Dialog.confirm({title : "Combi-Weapons", content : "Fire both Combi-Weapons?"}) : false

      let skill = weapon.isMelee ? "weaponSkill" : "ballisticSkill"
      let attribute = weapon.getSkillFor(actor).attribute

      let dialogData = await super.setupData({skill, attribute}, actor, options)

      dialogData.data.weapon = weapon;

      if (dialogData.data.targets[0])
      {
        let token = actor.getActiveTokens()[0]?.document
        let target = dialogData.data.targets[0];
        if (target && token)
        {
          dialogData.fields.distance = canvas.grid.measureDistances([{ ray: new Ray({ x: token.x, y: token.y }, { x: target.x, y: target.y }) }], { gridSpaces: true })[0]
        }
      }


      options.title = `${weapon.name} Test`

      return dialogData;
  }

  computeFields()
  {
    let weapon = this.weapon;

    this.tooltips.start(this)
    this.fields.pool += weapon.attack.base + weapon.attack.bonus
    this.fields.damage += weapon.system.damage.base + weapon.system.damage.bonus
    this.fields.ed.value += weapon.system.damage.ed.base + weapon.system.damage.ed.bonus
    this.fields.ap.value += weapon.system.damage.ap.base + weapon.system.damage.ap.bonus
    this.fields.ed.dice += weapon.system.damage.ed.dice
    this.fields.ap.dice += weapon.system.damage.ap.dice

    if (weapon.isMelee) {
      this.fields.damage += this.actor.system.attributes.strength.total
    }
    this.tooltips.finish(this, "Weapon")

    if (this.actor.isMob)
    {
      this.fields.pool += Math.ceil(this.actor.mob / 2)
      this.tooltips.add("pool", Math.ceil(this.actor.mob / 2), "Mob")
    }

    if (weapon.traitList.force) 
    {
      this.tooltips.start(this)
      if (this.actor.hasKeyword("PSYKER"))
      {
        this.fields.damage += Math.ceil(this.actor.system.attributes.willpower.total / 2)
        this.tooltips.finish(this, "Force Weapon")
      }
      else
      {
        this.fields.damage -= 2
        this.tooltips.finish(this, "Force Weapon (Not a Psyker)")
      }
    }

    this.tooltips.start(this)
    this.fields.difficulty += weapon.traitList.unwieldy ? parseInt(weapon.traitList.unwieldy.rating) : 0
    this.tooltips.finish(this, "Unwieldy")

    this.tooltips.start(this)
    if (this.actor.hasKeyword("ORK") && weapon.traitList["waaagh!"])
    {
        this.fields.pool += 1;
        if (this.actor.system.combat.wounds.value > 0)
        {
          this.fields.ed += 1
        }
    }
    this.tooltips.finish(this, "WAAAGH!")

    this.tooltips.start(this)

    if (weapon.traitList.rad)
    {
      this.fields.damageDice.addValue += Number(this.weapon.traitList.rad.rating);
    }
    this.tooltips.finish(this, "Rad")

    if (this.fields.aim)
    {
      this.tooltips.start(this)
      if (weapon.traitList.sniper)
      {
        this.fields.pool += 2
        this.fields.ed.value += (parseInt(weapon.traitList.sniper.rating) || 0)
        this.tooltips.finish(this, "Aim (Sniper)")
      }
      else 
      {
        this.fields.pool += 1
        this.tooltips.finish(this, "Aim")
      }
    }

    this.tooltips.start(this)
    if (this.fields.range == "short")
    {
      this.fields.pool += 1
      if (this.weapon.traitList.rapidFire)
      {
        this.fields.ed.value += (parseInt(weapon.traitList.rapidFire.rating) || 0)
      }
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
    // dialogData.damageValues = weapon.damageValues


  }

  computeInitialFields()
  {
    super.computeInitialFields();
    this.computeRange();

    if (this.weapon.traitList.melta && this.fields.range == "short") 
    {
      this.fields.damageDice.values = 
      {
        ones: 0,
        twos: 0,
        threes: 1,
        fours: 1,
        fives: 2,
        sixes: 2
      }
    }

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
            if (this.options.multi)
            {
              this.fields.difficulty += (this.options.multi - 1) * 2;
            }
            this.tooltips.finish(this, `Multi-Attack (${this.options.multi} Targets)`)


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

            this.tooltips.start(this)
            if (this.weapon.traitList.melta && this.fields.range == "short" && target.actor.type == "vehicle") 
            {
                this.fields.damageDice.values = 
                {
                  ones: 1,
                  twos: 1,
                  threes: 1,
                  fours: 2,
                  fives: 2,
                  sixes: 2
                }
            }
            this.tooltips.finish(this, `Melta`)

          // If using melee and target has parry weapon equipped, increase difficulty
          if (this.weapon.system.category == "melee" && target.actor.itemTypes.weapon.find(i => i.isEquipped && i.traitList.parry))
          {
              this.fields.difficulty += 1;
              this.tooltips.add("difficulty", 1, game.i18n.localize("TRAIT.Parry"))
          }
        }
    }
  }

  computeRange()
  {
      let range
    let weapon = this.weapon;
    if (this.fields.distance) {

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
      }, super._defaultFields());
  }
}

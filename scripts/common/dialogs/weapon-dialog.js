import { RollDialog } from "./base-dialog.js";

export class WeaponDialog extends RollDialog {
  async _render(...args)
  {
      await super._render(...args)

      if (this.distance)
        this.distance.dispatchEvent(new Event("change"))
  }


  static async create(data) {
    let hide = this.runConditional("hide", data)
    this.removeHiddenChanges(hide, data);
    data.condensedChanges = this.condenseChanges(data.changes);
    const html = await renderTemplate("systems/wrath-and-glory/template/dialog/weapon-roll.hbs", data);
    return new Promise((resolve) => {
      new this({
        title: game.i18n.localize(data.title),
        content: html,
        actor : data.actor,
        targets : data.targets,
        dialogData : data,
        buttons: {
          roll: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize("BUTTON.ROLL"),
            callback: async (html) => {
              let data = await this.dialogCallback(html)
          
              if (data.damage.dice)
              {
                let damageRoll = new Roll(`${data.damage.dice}d6`);
                await damageRoll.roll();
                damageRoll.toMessage({speaker : ChatMessage.getSpeaker({actor : data.actor}), flavor : "Damage Dice Roll"})
                data.damage.bonus += damageRoll.total;
              }

              if (data.ed.dice)
              {
                let edRoll = new Roll(`${data.ed.dice}d6`);
                await edRoll.roll();
                edRoll.toMessage({speaker : ChatMessage.getSpeaker({actor : data.actor}), flavor : "ED Dice Roll"})
                data.ed.bonus += edRoll.total;
              }

                
              if (data.ap.dice)
              {
                let apRoll = new Roll(`${data.ap.dice}d6`);
                await apRoll.roll();
                apRoll.toMessage({speaker : ChatMessage.getSpeaker({actor : data.actor}), flavor : "AP Dice Roll"})
                data.ap.bonus += apRoll.total;
              }
    

              resolve(data)
            },
          }
        },
        default: "roll"
      }, { width: 550 }).render(true)
    })
  }

  static dialogCallback(html) {
    let testData = super.dialogCallback(html)
    testData.damage.base = parseInt(html.find("#damage-base")[0].value);
    testData.damage.bonus = parseInt(html.find("#damage-bonus")[0].value);
    testData.damage.rank = html.find("#damage-rank")[0].value;
    testData.damage.dice = html.find("#damage-dice")[0].value;
    testData.ed.base = parseInt(html.find("#ed-base")[0].value);
    testData.ed.bonus = parseInt(html.find("#ed-bonus")[0].value);
    testData.ed.rank = html.find("#ed-rank")[0].value;
    testData.ed.dice = html.find("#ed-dice")[0].value;
    testData.ap.base = parseInt(html.find("#ap-base")[0].value);
    testData.ap.bonus = parseInt(html.find("#ap-bonus")[0].value);
    testData.ap.rank = html.find("#ap-rank")[0].value;
    testData.ap.dice = html.find("#ap-dice")[0].value;
    testData.ed.damageValues[1] = parseInt(html.find("#die-one")[0].value);
    testData.ed.damageValues[2] = parseInt(html.find("#die-two")[0].value);
    testData.ed.damageValues[3] = parseInt(html.find("#die-three")[0].value);
    testData.ed.damageValues[4] = parseInt(html.find("#die-four")[0].value);
    testData.ed.damageValues[5] = parseInt(html.find("#die-five")[0].value);
    testData.ed.damageValues[6]= parseInt(html.find("#die-six")[0].value);
    testData.wrath.base = parseInt(html.find("#wrath-base")[0].value);
    testData.range = html.find(".range")[0]?.value
    testData.aim = !!html.find(".aim.checked")[0]

    return testData
  }

  static _baseTestData() {
    return mergeObject({
      damage: {
        base: 0,
        rank: "none",
        bonus: 0
      },
      ed: {
        base: 0,
        rank: "none",
        bonus: 0,
        damageValues: {
          1: 0,
          2: 0,
          3: 0,
          4: 1,
          5: 1,
          6: 2
        }
      },
      ap: {
        base: 0,
        rank: "none",
        bonus: 0
      },
    }, super._baseTestData())
  }

  _calculateRange(range)
  {
    let weapon = this.data.dialogData.weapon
    if (range == "short")
    {
      this.inputs["pool.bonus"].value = parseInt(this.inputs["pool.bonus"].value) + 1
      if (weapon.traitList.rapidFire)
        this.inputs["ed.bonus"].value = parseInt(this.inputs["ed.bonus"].value) + (weapon.traitList.rapidFire.rating || 0)

    }
    else if (range == "long")
    {
      this.inputs["difficulty.bonus"].value = parseInt(this.inputs["difficulty.bonus"].value) + 2
    }
  }

  _calculateAim() {
    let weapon = this.data.dialogData.weapon
    if (this.userEntry.aim)
    {
      if (weapon.traitList.sniper)
      {
        this.inputs["pool.bonus"].value = parseInt(this.inputs["pool.bonus"].value) + 2
        this.inputs["ed.bonus"].value = parseInt(this.inputs["ed.bonus"].value) + (weapon.traitList.sniper.rating || 0)
      }
      else 
      {
        this.inputs["pool.bonus"].value = parseInt(this.inputs["pool.bonus"].value) + 1
      }
    }
  }

  applyEffects() {
    super.applyEffects();
    if (this.range)
    {
      this._calculateRange(this.range.value);
      this._calculateAim()
    }
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Reset effect values
    this.effectValues = flattenObject(mergeObject(this.effectValues, {
      "damage.base": null,
      "damage.rank": null,
      "damage.bonus": null,
      "ed.base": null,
      "ed.rank": null,
      "ed.bonus": null,
      "ap.base": null,
      "ap.rank": null,
      "ap.bonus": null,
    }))


    html.find('.damage,.ed,.ap').change(ev => {
      let type = ev.currentTarget.classList[0]
      let input = ev.currentTarget.classList[1]
      this.userEntry[`${type}.${input}`] = Number.isNumeric(ev.target.value) ? parseInt(ev.target.value) : ev.target.value
      this.applyEffects()
    }).each((i, input) => {
      this.inputs[`${input.classList[0]}.${input.classList[1]}`] = input
    })

    this.range = html.find(".range").change(ev => {
      this.applyEffects();
    })[0]

    this.distance = html.find(".distance").change(ev => {
      let rangeNum = parseInt(ev.target.value);
      let weapon = this.data.dialogData.weapon
      let range

      if (rangeNum <= weapon.range.short)
      {
        range = "short"
      }

      else if (rangeNum > weapon.range.short && rangeNum <= weapon.range.medium)
      {
        range = "medium"
      }

      else if (rangeNum > weapon.range.medium && rangeNum <= weapon.range.long)
      {
        range = "long"
      }
      
      else 
      {
        range = ""
        if (rangeNum)
          ui.notifications.warn(game.i18n.localize("DIALOG.OUT_OF_RANGE"))
      }
      this.range.value = range;
      this.range.dispatchEvent(new Event("change"))
    })[0]

    html.find(".aim").click(ev => {
      ev.currentTarget.classList.toggle("checked")

      if (ev.currentTarget.classList.contains("checked"))
      {
        ev.currentTarget.innerHTML = '<i class="fas fa-check"></i>'
        this.userEntry.aim = true
      }
      else 
      {
        ev.currentTarget.innerHTML = ''
        this.userEntry.aim = false
      }

      this.applyEffects();
    })

    this.userEntry = flattenObject(mergeObject(this.userEntry, {
      "damage.base": parseInt(this.inputs["damage.base"].value),
      "damage.rank": this.inputs["damage.rank"].value,
      "damage.bonus": parseInt(this.inputs["damage.bonus"].value),
      "ed.base": parseInt(this.inputs["ed.base"].value),
      "ed.rank": this.inputs["ed.rank"].value,
      "ed.bonus": parseInt(this.inputs["ed.bonus"].value),
      "ap.base": parseInt(this.inputs["ap.base"].value),
      "ap.rank": this.inputs["ap.rank"].value,
      "ap.bonus": parseInt(this.inputs["ap.bonus"].value),
      "aim" : false
    }))
  }
}

import { RollDialog } from "./base-dialog.js";

export class PowerDialog extends RollDialog {

  static async create(data) {
    const html = await renderTemplate("systems/wrath-and-glory/template/dialog/psychic-roll.hbs", data);
    return new Promise((resolve) => {
      new this({
        title: game.i18n.localize(data.title),
        content: html,
        actor: data.actor,
        targets: data.targets,
        dialogData: data,
        buttons: {
          roll: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize("BUTTON.ROLL"),
            callback: async (html) => {
              let data = this.dialogCallback(html)
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
    testData.ed.base = parseInt(html.find("#ed-base")[0].value);
    testData.ed.bonus = parseInt(html.find("#ed-bonus")[0].value);
    testData.ed.rank = html.find("#ed-rank")[0].value;
    testData.ed.damageValues[1] = parseInt(html.find("#die-one")[0].value);
    testData.ed.damageValues[2] = parseInt(html.find("#die-two")[0].value);
    testData.ed.damageValues[3] = parseInt(html.find("#die-three")[0].value);
    testData.ed.damageValues[4] = parseInt(html.find("#die-four")[0].value);
    testData.ed.damageValues[5] = parseInt(html.find("#die-five")[0].value);
    testData.ed.damageValues[6] = parseInt(html.find("#die-six")[0].value);
    testData.wrath.base = parseInt(html.find("#wrath-base")[0].value);
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
      potency: 0
    }, super._baseTestData())
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
      "wrath": null
    }))


    html.find('.damage,.ed').change(ev => {
      let type = ev.currentTarget.classList[0]
      let input = ev.currentTarget.classList[1]
      this.userEntry[`${type}.${input}`] = Number.isNumeric(ev.target.value) ? parseInt(ev.target.value) : ev.target.value
      this.applyEffects()
    }).each((i, input) => {
      this.inputs[`${input.classList[0]}.${input.classList[1]}`] = input
    })

    this.inputs.wrath = html.find("#wrath-base").change(ev => {
      this.userEntry["wrath"] = parseInt(ev.target.value)
      this.applyEffects();
    })[0]


    this.userEntry = flattenObject(mergeObject(this.userEntry, {
      "damage.base": parseInt(this.inputs["damage.base"].value),
      "damage.rank": this.inputs["damage.rank"].value,
      "damage.bonus": parseInt(this.inputs["damage.bonus"].value),
      "ed.base": parseInt(this.inputs["ed.base"].value),
      "ed.rank": this.inputs["ed.rank"].value,
      "ed.bonus": parseInt(this.inputs["ed.bonus"].value),
      "wrath": parseInt(this.inputs["wrath"].value)
    }))
  }

}
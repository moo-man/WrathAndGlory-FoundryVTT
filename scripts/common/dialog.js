export class RollDialog extends Dialog {
  static async create(data) {
    const html = await renderTemplate("systems/wrath-and-glory/template/dialog/common-roll.html", data);
    return new Promise((resolve) => {
      new this({
        title: game.i18n.localize(data.name),
        content: html,
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
      }).render(true)
    })
  }

  static dialogCallback(html) {
    let testData = this._baseTestData()
    testData.difficulty.target = parseInt(html.find("#difficulty-target")[0].value, 10);
    testData.difficulty.penalty = parseInt(html.find("#difficulty-penalty")[0].value, 10);
    testData.difficulty.penalty -= getRank(testData, html.find("#difficulty-rank")[0].value);
    testData.pool.size = parseInt(html.find("#pool-size")[0].value, 10);
    testData.pool.bonus = parseInt(html.find("#pool-bonus")[0].value, 10);
    testData.pool.bonus += getRank(testData, html.find("#pool-rank")[0].value);
    return testData
  }


  static _baseTestData() {
    return {
      difficulty: {
        target: 3,
        penalty: 0,
        rank: "none"
      },
      pool: {
        size: 1,
        bonus: 0,
        rank: "none"
      },
      wrath: {
        base: 1
      }
    };
  }
}

export class WeaponDialog extends RollDialog {

  static async create(data) {
    const html = await renderTemplate("systems/wrath-and-glory/template/dialog/weapon-roll.html", data);
    return new Promise((resolve) => {
      new this({
        title: game.i18n.localize(data.title),
        content: html,
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
      }).render(true)
    })
  }

  static dialogCallback(html) {
    let testData = super.dialogCallback(html)
    testData.damage.base = parseInt(html.find("#damage-base")[0].value, 10);
    testData.damage.bonus = parseInt(html.find("#damage-bonus")[0].value, 10);
    testData.damage.bonus += getRank(testData, html.find("#damage-rank")[0].value);
    testData.ed.base = parseInt(html.find("#ed-base")[0].value, 10);
    testData.ed.bonus = parseInt(html.find("#ed-bonus")[0].value, 10);
    testData.ed.bonus += getRank(testData, html.find("#ed-rank")[0].value);
    testData.ap.base = parseInt(html.find("#ap-base")[0].value, 10);
    testData.ap.bonus = parseInt(html.find("#ap-bonus")[0].value, 10);
    testData.ap.bonus += getRank(testData, html.find("#ap-rank")[0].value);
    testData.traits = html.find("#traits")[0].value;
    testData.ed.die.one = parseInt(html.find("#die-one")[0].value, 10);
    testData.ed.die.two = parseInt(html.find("#die-two")[0].value, 10);
    testData.ed.die.three = parseInt(html.find("#die-three")[0].value, 10);
    testData.ed.die.four = parseInt(html.find("#die-four")[0].value, 10);
    testData.ed.die.five = parseInt(html.find("#die-five")[0].value, 10);
    testData.ed.die.six = parseInt(html.find("#die-six")[0].value, 10);
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
        die: {
          one: 0,
          two: 0,
          three: 0,
          four: 1,
          five: 1,
          six: 2
        }
      },
      ap: {
        base: 0,
        rank: "none",
        bonus: 0
      },
    }, super._baseTestData())
  }

}

export async function preparePsychicRoll(testData) {
  const html = await renderTemplate("systems/wrath-and-glory/template/dialog/psychic-roll.html", testData);
  let dialog = new Dialog({
    title: testData.name,
    content: html,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("BUTTON.CANCEL"),
        callback: () => { },
      },
      roll: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize("BUTTON.ROLL"),
        callback: async (html) => {
          testData.name = testData.name;
          testData.difficulty.target = parseInt(html.find("#difficulty-target")[0].value, 10);
          testData.difficulty.penalty = parseInt(html.find("#difficulty-penalty")[0].value, 10);
          testData.difficulty.penalty -= getRank(testData, html.find("#difficulty-rank")[0].value);
          testData.pool.size = parseInt(html.find("#pool-size")[0].value, 10);
          testData.pool.bonus = parseInt(html.find("#pool-bonus")[0].value, 10);
          testData.pool.bonus += getRank(testData, html.find("#pool-rank")[0].value);
          testData.wrath.base = parseInt(html.find("#wrath-base")[0].value, 10);
          testData.damage.base = parseInt(html.find("#damage-base")[0].value, 10);
          testData.damage.bonus = parseInt(html.find("#damage-bonus")[0].value, 10);
          testData.damage.bonus += getRank(testData, html.find("#damage-rank")[0].value);
          testData.ed.base = parseInt(html.find("#ed-base")[0].value, 10);
          testData.ed.bonus = parseInt(html.find("#ed-bonus")[0].value, 10);
          testData.ed.bonus += getRank(testData, html.find("#ed-rank")[0].value);
          testData.ed.die.one = parseInt(html.find("#die-one")[0].value, 10);
          testData.ed.die.two = parseInt(html.find("#die-two")[0].value, 10);
          testData.ed.die.three = parseInt(html.find("#die-three")[0].value, 10);
          testData.ed.die.four = parseInt(html.find("#die-four")[0].value, 10);
          testData.ed.die.five = parseInt(html.find("#die-five")[0].value, 10);
          testData.ed.die.six = parseInt(html.find("#die-six")[0].value, 10);
          testData.potency = html.find("#potency")[0].value;
          await psychicRoll(testData);
        },
      }
    },
    default: "roll",
    close: () => { },
  }, { width: 500 });
  dialog.render(true);
}

export async function prepareWeaponRoll(testData) {
  testData.difficulty.target = _getTargetDefense();
  const html = await renderTemplate("systems/wrath-and-glory/template/dialog/weapon-roll.html", testData);
  let dialog = new Dialog({
    title: testData.name,
    content: html,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("BUTTON.CANCEL"),
        callback: () => { },
      },
      roll: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize("BUTTON.ROLL"),
        callback: async (html) => {
          testData.name = testData.name;
          testData.difficulty.target = parseInt(html.find("#difficulty-target")[0].value, 10);
          testData.difficulty.penalty = parseInt(html.find("#difficulty-penalty")[0].value, 10);
          testData.difficulty.penalty -= getRank(testData, html.find("#difficulty-rank")[0].value);
          testData.pool.size = parseInt(html.find("#pool-size")[0].value, 10);
          testData.pool.bonus = parseInt(html.find("#pool-bonus")[0].value, 10);
          testData.pool.bonus += getRank(testData, html.find("#pool-rank")[0].value);
          testData.damage.base = parseInt(html.find("#damage-base")[0].value, 10);
          testData.damage.bonus = parseInt(html.find("#damage-bonus")[0].value, 10);
          testData.damage.bonus += getRank(testData, html.find("#damage-rank")[0].value);
          testData.ed.base = parseInt(html.find("#ed-base")[0].value, 10);
          testData.ed.bonus = parseInt(html.find("#ed-bonus")[0].value, 10);
          testData.ed.bonus += getRank(testData, html.find("#ed-rank")[0].value);
          testData.ap.base = parseInt(html.find("#ap-base")[0].value, 10);
          testData.ap.bonus = parseInt(html.find("#ap-bonus")[0].value, 10);
          testData.ap.bonus += getRank(testData, html.find("#ap-rank")[0].value);
          testData.traits = html.find("#traits")[0].value;
          testData.ed.die.one = parseInt(html.find("#die-one")[0].value, 10);
          testData.ed.die.two = parseInt(html.find("#die-two")[0].value, 10);
          testData.ed.die.three = parseInt(html.find("#die-three")[0].value, 10);
          testData.ed.die.four = parseInt(html.find("#die-four")[0].value, 10);
          testData.ed.die.five = parseInt(html.find("#die-five")[0].value, 10);
          testData.ed.die.six = parseInt(html.find("#die-six")[0].value, 10);
          await weaponRoll(testData);
        },
      }
    },
    default: "roll",
    close: () => { },
  }, { width: 500 });
  dialog.render(true);
}

export async function prepareDamageRoll(testData) {
  const html = await renderTemplate("systems/wrath-and-glory/template/dialog/damage-roll.html", testData);
  let dialog = new Dialog({
    title: testData.name,
    content: html,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("BUTTON.CANCEL"),
        callback: () => { },
      },
      roll: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize("BUTTON.ROLL"),
        callback: async (html) => {
          testData.name = game.i18n.localize(testData.name);
          testData.damage.base = parseInt(html.find("#damage-base")[0].value, 10);
          testData.damage.bonus = parseInt(html.find("#damage-bonus")[0].value, 10);
          testData.damage.bonus += getRank(testData, html.find("#damage-rank")[0].value);
          testData.ed.base = parseInt(html.find("#ed-base")[0].value, 10);
          testData.ed.bonus = parseInt(html.find("#ed-bonus")[0].value, 10);
          testData.ed.bonus += getRank(testData, html.find("#ed-rank")[0].value);
          testData.ap.base = parseInt(html.find("#ap-base")[0].value, 10);
          testData.ap.bonus = parseInt(html.find("#ap-bonus")[0].value, 10);
          testData.ap.bonus += getRank(testData, html.find("#ap-rank")[0].value);
          testData.traits = html.find("#traits")[0].value;
          await damageRoll(testData);
        },
      }
    },
    default: "roll",
    close: () => { },
  }, { width: 260 });
  dialog.render(true);
}

function _getTargetDefense() {
  const targets = game.user.targets.size;
  if (0 >= targets) {
    return 3;
  }

  return game.user.targets.values().next().value.actor.combat.defense.total;
}

function getRank(testData, rank) {
  switch (rank) {
    case "none":
      return 0;
    case "single":
      return testData.rank;
    case "double":
      return (testData.rank * 2);
    case "minus-single":
      return testData.rank;
    case "minus-double":
      return (testData.rank * 2);
    default:
      return 0;
  }
}

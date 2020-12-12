import { commonRoll, weaponRoll, damageRoll, psychicRoll } from "./roll.js";

export async function prepareCommonRoll(rollData) {
  const html = await renderTemplate("systems/wrath-and-glory/template/dialog/common-roll.html", rollData);
  let dialog = new Dialog({
    title: game.i18n.localize(rollData.name),
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
          rollData.name = game.i18n.localize(rollData.name);
          rollData.difficulty.target = parseInt(html.find("#difficulty-target")[0].value, 10);
          rollData.difficulty.penalty = parseInt(html.find("#difficulty-penalty")[0].value, 10);
          rollData.difficulty.penalty -= getRank(rollData, html.find("#difficulty-rank")[0].value);
          rollData.pool.size = parseInt(html.find("#pool-size")[0].value, 10);
          rollData.pool.bonus = parseInt(html.find("#pool-bonus")[0].value, 10);
          rollData.pool.bonus += getRank(rollData, html.find("#pool-rank")[0].value);
          await commonRoll(rollData);
        },
      }
    },
    default: "roll",
    close: () => { },
  }, { width: 260 });
  dialog.render(true);
}

export async function preparePsychicRoll(rollData) {
  const html = await renderTemplate("systems/wrath-and-glory/template/dialog/psychic-roll.html", rollData);
  let dialog = new Dialog({
    title: rollData.name,
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
          rollData.name = rollData.name;
          rollData.difficulty.target = parseInt(html.find("#difficulty-target")[0].value, 10);
          rollData.difficulty.penalty = parseInt(html.find("#difficulty-penalty")[0].value, 10);
          rollData.difficulty.penalty -= getRank(rollData, html.find("#difficulty-rank")[0].value);
          rollData.pool.size = parseInt(html.find("#pool-size")[0].value, 10);
          rollData.pool.bonus = parseInt(html.find("#pool-bonus")[0].value, 10);
          rollData.pool.bonus += getRank(rollData, html.find("#pool-rank")[0].value);
          rollData.wrath.base = parseInt(html.find("#wrath-base")[0].value, 10);
          rollData.weapon.damage.base = parseInt(html.find("#damage-base")[0].value, 10);
          rollData.weapon.damage.bonus = parseInt(html.find("#damage-bonus")[0].value, 10);
          rollData.weapon.damage.bonus += getRank(rollData, html.find("#damage-rank")[0].value);
          rollData.weapon.ed.base = parseInt(html.find("#ed-base")[0].value, 10);
          rollData.weapon.ed.bonus = parseInt(html.find("#ed-bonus")[0].value, 10);
          rollData.weapon.ed.bonus += getRank(rollData, html.find("#ed-rank")[0].value);
          rollData.weapon.ed.die.one = parseInt(html.find("#die-one")[0].value, 10);
          rollData.weapon.ed.die.two = parseInt(html.find("#die-two")[0].value, 10);
          rollData.weapon.ed.die.three = parseInt(html.find("#die-three")[0].value, 10);
          rollData.weapon.ed.die.four = parseInt(html.find("#die-four")[0].value, 10);
          rollData.weapon.ed.die.five = parseInt(html.find("#die-five")[0].value, 10);
          rollData.weapon.ed.die.six = parseInt(html.find("#die-six")[0].value, 10);
          rollData.weapon.potency = html.find("#potency")[0].value;
          await psychicRoll(rollData);
        },
      }
    },
    default: "roll",
    close: () => { },
  }, { width: 500 });
  dialog.render(true);
}

export async function prepareWeaponRoll(rollData) {
  rollData.difficulty.target = _getTargetDefense();
  const html = await renderTemplate("systems/wrath-and-glory/template/dialog/weapon-roll.html", rollData);
  let dialog = new Dialog({
    title: rollData.name,
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
          rollData.name = rollData.name;
          rollData.difficulty.target = parseInt(html.find("#difficulty-target")[0].value, 10);
          rollData.difficulty.penalty = parseInt(html.find("#difficulty-penalty")[0].value, 10);
          rollData.difficulty.penalty -= getRank(rollData, html.find("#difficulty-rank")[0].value);
          rollData.pool.size = parseInt(html.find("#pool-size")[0].value, 10);
          rollData.pool.bonus = parseInt(html.find("#pool-bonus")[0].value, 10);
          rollData.pool.bonus += getRank(rollData, html.find("#pool-rank")[0].value);
          rollData.weapon.damage.base = parseInt(html.find("#damage-base")[0].value, 10);
          rollData.weapon.damage.bonus = parseInt(html.find("#damage-bonus")[0].value, 10);
          rollData.weapon.damage.bonus += getRank(rollData, html.find("#damage-rank")[0].value);
          rollData.weapon.ed.base = parseInt(html.find("#ed-base")[0].value, 10);
          rollData.weapon.ed.bonus = parseInt(html.find("#ed-bonus")[0].value, 10);
          rollData.weapon.ed.bonus += getRank(rollData, html.find("#ed-rank")[0].value);
          rollData.weapon.ap.base = parseInt(html.find("#ap-base")[0].value, 10);
          rollData.weapon.ap.bonus = parseInt(html.find("#ap-bonus")[0].value, 10);
          rollData.weapon.ap.bonus += getRank(rollData, html.find("#ap-rank")[0].value);
          rollData.weapon.traits = html.find("#traits")[0].value;
          rollData.weapon.ed.die.one = parseInt(html.find("#die-one")[0].value, 10);
          rollData.weapon.ed.die.two = parseInt(html.find("#die-two")[0].value, 10);
          rollData.weapon.ed.die.three = parseInt(html.find("#die-three")[0].value, 10);
          rollData.weapon.ed.die.four = parseInt(html.find("#die-four")[0].value, 10);
          rollData.weapon.ed.die.five = parseInt(html.find("#die-five")[0].value, 10);
          rollData.weapon.ed.die.six = parseInt(html.find("#die-six")[0].value, 10);
          await weaponRoll(rollData);
        },
      }
    },
    default: "roll",
    close: () => { },
  }, { width: 500 });
  dialog.render(true);
}

export async function prepareDamageRoll(rollData) {
  const html = await renderTemplate("systems/wrath-and-glory/template/dialog/damage-roll.html", rollData);
  let dialog = new Dialog({
    title: rollData.name,
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
          rollData.name = game.i18n.localize(rollData.name);
          rollData.weapon.damage.base = parseInt(html.find("#damage-base")[0].value, 10);
          rollData.weapon.damage.bonus = parseInt(html.find("#damage-bonus")[0].value, 10);
          rollData.weapon.damage.bonus += getRank(rollData, html.find("#damage-rank")[0].value);
          rollData.weapon.ed.base = parseInt(html.find("#ed-base")[0].value, 10);
          rollData.weapon.ed.bonus = parseInt(html.find("#damage-bonus")[0].value, 10);
          rollData.weapon.ed.bonus += getRank(rollData, html.find("#damage-rank")[0].value);
          rollData.weapon.ap.base = parseInt(html.find("#ap-base")[0].value, 10);
          rollData.weapon.ap.bonus = parseInt(html.find("#ap-bonus")[0].value, 10);
          rollData.weapon.ap.bonus += getRank(rollData, html.find("#ap-rank")[0].value);
          rollData.weapon.traits = html.find("#traits")[0].value;
          await damageRoll(rollData);
        },
      }
    },
    default: "roll",
    close: () => { },
  }, { width: 260 });
  dialog.render(true);
}

function _getTargetDefense(combat) {
  const target = game.user.targets.values().next().value;
  if (target === undefined) {
    return 3;
  } else {
    return target.actor.data.data.combat.defense.total;
  }
}

function getRank(rollData, rank) {
  switch (rank) {
    case "none":
      return 0;
    case "single":
      return rollData.rank;
    case "double":
      return (rollData.rank * 2);
      case "minus-single":
      return rollData.rank;
    case "minus-double":
      return (rollData.rank * 2);
    default:
      return 0;
  }
}
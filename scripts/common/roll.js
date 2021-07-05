export async function commonRoll(rollData) {
  _rollPoolDice(rollData);
  _computeChat(rollData);
  await _sendToChat(rollData);
}

export async function weaponRoll(rollData) {
  let weaponName = rollData.name;
  rollData.name = game.i18n.localize(rollData.skillName);
  await commonRoll(rollData);
  rollData.name = weaponName;
  if (rollData.result.isSuccess) {
    _rollDamage(rollData);
    _computeDamageChat(rollData);
    await _sendDamageToChat(rollData);
  }
}

export async function psychicRoll(rollData) {
  let psychicName = rollData.name;
  rollData.name = game.i18n.localize(rollData.skillName);
  await commonRoll(rollData);
  rollData.name = psychicName;
  if (rollData.result.isSuccess && _hasDamage(rollData)) {
    _rollDamage(rollData);
    _computeDamageChat(rollData);
    await _sendDamageToChat(rollData);
  }
}

export async function damageRoll(rollData) {
  _rollDamage(rollData);
  _computeDamageChat(rollData);
  await _sendDamageToChat(rollData);
}

export async function reroll(rollData) {
  rollData.rolls.hit = [];
  rollData.result.dice = rollData.result.dice.map(die => {
    if (die.rerollable) {
      let r = new Roll("1d6", {}).evaluate();
      rollData.rolls.hit.push(r);
      if (die.isWrath) {
        return _computeWrath(r.total);
      } else {
        return _computeDice(r.total);
      }
    } else {
      return die;
    }
  });
  _computeChat(rollData);
  await _sendToChat(rollData);
}

function _rollPoolDice(rollData) {
  let wrathSize = rollData.wrath.base > 0 ? rollData.wrath.base : 1;
  let poolSize = rollData.pool.size + rollData.pool.bonus - 1;
  rollData.dn = rollData.difficulty.target + rollData.difficulty.penalty;
  if (poolSize > 0) {
    _rollDice(rollData, `${poolSize}d6`, false);
  }
  _rollDice(rollData, `${wrathSize}d6`, true);
}

function _rollDice(rollData, formula, isWrath) {
  let r = new Roll(formula, {});
  r.evaluate();
  r.terms.forEach((term) => {
    if (typeof term === 'object' && term !== null) {
      term.results.forEach(result => {
        let die = {};
        if (isWrath) {
          die = _computeWrath(result.result);
        } else {
          die = _computeDice(result.result);
        }
        rollData.result.dice.push(die);
      });
    }
  });
  rollData.rolls.hit.push(r);
}

function _rollDamage(rollData) {
  let ed = rollData.weapon.ed.base + rollData.weapon.ed.bonus;
  let formula = `${ed}d6`;
  let r = new Roll(formula, {});
  r.evaluate();
  rollData.result.damage = {
    dice: [],
    total: rollData.weapon.damage.base + rollData.weapon.damage.bonus
  };
  r.terms.forEach((term) => {
    if (typeof term === 'object' && term !== null) {
      term.results.forEach(result => {
        let die = _computeExtraDice(result.result, rollData.weapon.ed.die);
        rollData.result.damage.total += die.value;
        rollData.result.damage.dice.push(die);
      });
    }
  });
  rollData.rolls.damage.push(r);
}

function _computeChat(rollData) {
  rollData.result.dice.sort((a, b) => { return b.weight - a.weight });
  rollData.result.success = _countSuccess(rollData);
  rollData.result.failure = _countFailure(rollData);
  rollData.result.shifting = _countShifting(rollData);
  rollData.result.isSuccess = rollData.result.success >= rollData.dn;
  rollData.result.isWrathCritical = _hasWrathValue(rollData, 6);
  rollData.result.isWrathComplication = _hasWrathValue(rollData, 1);
}

function _computeDamageChat(rollData) {
  rollData.result.damage.dice.sort((a, b) => { return b.weight - a.weight });
  if (rollData.weapon.ap) {
    rollData.weapon.ap.total = rollData.weapon.ap.base + rollData.weapon.ap.bonus;
  }
}

function _computeDice(dieValue) {
  if (dieValue === 6) {
    return {
      name: "icon",
      value: 2,
      score: dieValue,
      isWrath: false,
      rerollable: false,
      weight: 3
    };
  } else if (dieValue > 3) {
    return {
      name: "success",
      value: 1,
      score: dieValue,
      isWrath: false,
      rerollable: false,
      weight: 2
    };
  } else {
    return {
      name: "failed",
      value: 0,
      score: dieValue,
      isWrath: false,
      rerollable: true,
      weight: 1
    };
  }
}

function _computeExtraDice(dieValue, die) {
  let propertyName = Object.keys(die)[dieValue - 1];
  let value = die[propertyName];
  let name = "failed";
  let weight = 1;
  if (value >= 2) {
    name = "icon";
    weight = 3;
  } else if (value === 1) {
    name = "success";
    weight = 2;
  }
  return {
    name: name,
    value: value,
    score: dieValue,
    isWrath: false,
    rerollable: false,
    weight: weight
  };
}

function _computeWrath(dieValue) {
  if (dieValue === 6) {
    return {
      name: "wrath-critical",
      value: 2,
      score: dieValue,
      isWrath: true,
      rerollable: false,
      weight: 0
    };
  } else if (dieValue > 3) {
    return {
      name: "wrath-success",
      value: 1,
      score: dieValue,
      isWrath: true,
      rerollable: false,
      weight: -1
    };
  } else if (dieValue === 1) {
    return {
      name: "wrath-complication",
      value: 0,
      score: dieValue,
      isWrath: true,
      rerollable: false,
      weight: -3
    };
  } else {
    return {
      name: "wrath-failed",
      value: 0,
      score: dieValue,
      isWrath: true,
      rerollable: true,
      weight: -2
    };
  }
}

function _countSuccess(rollData) {
  let success = 0;
  for (let i = 0; i < rollData.result.dice.length; i++) {
    success += rollData.result.dice[i].value;
  }
  return success;
}

function _countFailure(rollData) {
  let failure = 0;
  for (let i = 0; i < rollData.result.dice.length; i++) {
    if (rollData.result.dice[i].value === 0) {
      failure++;
    }
  }
  return failure;
}

function _countShifting(rollData) {
  let shifting = 0;
  let margin = rollData.result.success - rollData.dn;
  for (let i = 0; i < rollData.result.dice.length; i++) {
    if (rollData.result.dice[i].value === 2 && margin - 2 >= 0) {
      shifting++;
      margin = margin - 2;
    }
  }
  return shifting;
}

function _hasWrathValue(rollData, dieValue) {
  for (let i = 0; i < rollData.result.dice.length; i++) {
    let die = rollData.result.dice[i];
    if (die.isWrath && die.score === dieValue) {
      return true;
    }
  }
  return false;
}

function _hasDamage(rollData) {
  let damage = rollData.weapon.damage.base + rollData.weapon.damage.bonus;
  let ed = rollData.weapon.ed.base + rollData.weapon.ed.bonus;
  return (damage > 0 || ed > 0);
}

function _getRoll(rolls)
{
  const pool = PoolTerm.fromRolls(rolls);
  return Roll.fromTerms([pool]);
}

async function _sendToChat(rollData) {
  const html = await renderTemplate("systems/wrath-and-glory/template/chat/roll.html", rollData);
  let chatData = {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: _getRoll(rollData.rolls.hit),
    user: game.user.id,
    rollMode: game.settings.get("core", "rollMode"),
    content: html
  };
  if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
    chatData.whisper = ChatMessage.getWhisperRecipients("GM");
  } else if (chatData.rollMode === "selfroll") {
    chatData.whisper = [game.user];
  }
  ChatMessage.create(chatData);
}

async function _sendDamageToChat(rollData) {
  const html = await renderTemplate("systems/wrath-and-glory/template/chat/damage.html", rollData);
  let chatData = {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: _getRoll(rollData.rolls.damage),
    user: game.user.id,
    rollMode: game.settings.get("core", "rollMode"),
    content: html
  };
  if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
    chatData.whisper = ChatMessage.getWhisperRecipients("GM");
  } else if (chatData.rollMode === "selfroll") {
    chatData.whisper = [game.user];
  }
  ChatMessage.create(chatData);
}

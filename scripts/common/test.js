export class WNGTest {
  constructor(data = {}) {
    this.data = {
      testData: {
        difficulty: data.difficulty,
        pool: data.pool,
        attribute: data.attribute,
        skill: data.skill,
        wrath: data.wrath
      },
      context: {
        title: data.title,
        type: data.type,
        speaker: data.speaker,
        rollClass: this.constructor.name,
        rerolled: data.rerolled || false
      },
      result: {}
    }
  }


  static recreate(data) {
    let test = new game.wng.rollClasses[data.context.rollClass]()
    test.data = data;
    test.roll = Roll.fromData(test.result.roll)
    if (test.context.rerolled)
      test.rerolledTest = Roll.fromData(test.result.reroll)
    if (test.result.damage)
      test.damageRoll = Roll.fromData(test.result.damage.roll)
    return test
  }

  async rollTest() {
    this.result.wrathSize = this.testData.wrath.base > 0 ? this.testData.wrath.base : 1;
    this.result.poolSize = this.testData.pool.size + this.testData.pool.bonus - 1 + this.getRankNum(this.testData.pool.rank);
    this.result.dn = this.testData.difficulty.target + this.testData.difficulty.penalty - this.getRankNum(this.testData.difficulty.rank);
    await this._rollDice()
    this._computeResult();
  }

  async _rollDice() {

    this.roll = Roll.fromTerms([
      new PoolDie({ number: this.result.poolSize, faces: 6 }),
      new OperatorTerm({ operator: "+" }),
      new WrathDie({ number: this.result.wrathSize, faces: 6 })
    ])

    await this.roll.evaluate({ async: true });
  }

  _computeResult() {
    this.result.roll = this.roll.toJSON()
    this.result.dice = this.roll.dice.reduce((prev, current) => prev.concat(current.results), [])
    if (this.context.rerolled) {
      this.result.reroll = this.rerolledTest.toJSON()
      this.result.rerolledDice = this.rerolledTest.dice.reduce((prev, current) => prev.concat(current.results.map(i => { i.rerolled = true; return i })), [])
      this.result.originalRoll = this.result.dice

      // Merge reroll and roll
      this.result.dice = this.result.dice.reduce((prev, current, i) => {
        if (current.rerollable)
          prev.push(this.result.rerolledDice[i])
        else {
          prev.push(current)
        }
        return prev
      }, [])
    }
    this.result.success = this.result.dice.reduce((prev, current) => prev + current.value, 0)
    this.result.failure = this.result.dice.reduce((prev, current) => prev + (current.value === 0 ? 1 : 0), 0)
    this.result.shifting = this._countShifting();
    this.result.isSuccess = this.result.success >= this.result.dn;
    this.result.isWrathCritical = this.result.dice.some(r => r.isWrath && r.result == 6)
    this.result.isWrathComplication = this.result.dice.some(r => r.isWrath && r.result == 1)
  }

  async reroll() {
    this.context.rerolled = true;
    this.rerolledTest = await this.roll.reroll()
    this._computeResult();
    if (game.dice3d) {
      let rerollShow = this.rerolledTest.toJSON()
      rerollShow.terms = this.rerolledTest.dice.map((term, t) => {
        term.results = term.results.map((die, i) => {
          if (this.roll.dice[t].results[i].rerollable)
            return die
        }).filter(i => i)
        return term
      })

      await game.dice3d.showForRoll(Roll.fromData(rerollShow))

    }
  }

  async sendToChat(rerenderMessage) {
    const html = await renderTemplate("systems/wrath-and-glory/template/chat/roll.html", this);
    let chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: this.roll,
      flags: { "wrath-and-glory.testData": this.data },
      user: game.user.id,
      rollMode: game.settings.get("core", "rollMode"),
      content: html
    };
    if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    } else if (chatData.rollMode === "selfroll") {
      chatData.whisper = [game.user];
    }
    if (!rerenderMessage)
      return ChatMessage.create(chatData);
    else
    {
      delete chatData.roll
      return rerenderMessage.update(chatData)
    }
  }

  _countShifting() {
    let shifting = 0;
    let surplus = this.result.success - this.result.dn;
    for (let i = 0; i < this.result.dice.length; i++) {
      if (this.result.dice[i].value === 2 && surplus >= 2) {
        shifting++;
        surplus -= 2
      }
    }
    return shifting;
  }

  getRankNum(rank) {
    switch (rank) {
      case "none":
        return 0;
      case "single":
        return this.actor.advances.rank;
      case "double":
        return (this.actor.advances.rank * 2);
      case "minus-single":
        return this.actor.advances.rank;
      case "minus-double":
        return (this.actor.advances.rank * 2);
      default:
        return 0;
    }
  }

  async rollDamage() {
    let ed = this.testData.ed.base + this.testData.ed.bonus + this.getRankNum(this.testData.ed.rank);
    let formula = `${ed}d6`;
    let r = new Roll(formula, {});
    r.evaluate({ async: true });
    this.result.damage = {
      total: this.testData.damage.base + this.testData.damage.bonus + this.getRankNum(this.testData.damage.rank),
      ap: this.testData.ap.base + this.testData.ap.bonus + this.getRankNum(this.testData.ap.rank),
      dice: []
    };
    r.terms.forEach((term) => {
      if (typeof term === 'object' && term !== null) {
        term.results.forEach(result => {
          let die = this._computeExtraDice(result.result, this.testData.ed.die);
          this.result.damage.total += die.value;
          this.result.damage.dice.push(die);
        });
      }
    });
    this.damageRoll = r;
    this.result.damage.roll = r.toJSON()
  }


  _computeExtraDice(dieValue, die) {
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
      result: dieValue,
      isWrath: false,
      rerollable: false,
      weight: weight
    };
  }

  async sendDamageToChat() {
    const html = await renderTemplate("systems/wrath-and-glory/template/chat/damage.html", this);
    let chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: this.damageRoll,
      flags: { "wrath-and-glory.testData": this.data },
      user: game.user.id,
      rollMode: game.settings.get("core", "rollMode"),
      content: html
    };
    if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    } else if (chatData.rollMode === "selfroll") {
      chatData.whisper = [game.user];
    }
    return ChatMessage.create(chatData);
  }


  get testData() { return this.data.testData; }
  get context() { return this.data.context; }
  get result() { return this.data.result; }
  get attribute() { return this.actor.attributes[this.data.testData.attribute] }
  get skill() { return this.actor.skills[this.data.testData.skill] }

  get item() { return this.actor.items.get(this.testData.itemId) }
  get actor() { return game.wng.utility.getSpeaker(this.context.speaker) }









  /*
  
    async  weaponRoll(this.testData) {
      let weaponName = this.testData.name;
      this.testData.name = game.i18n.localize(this.testData.skillName);
      await commonRoll(this.testData);
      this.testData.name = weaponName;
      if (this.result.isSuccess) {
        _rollDamage(this.testData);
        _computeDamageChat(this.testData);
        await _sendDamageToChat(this.testData);
      }
    }
    
    async  psychicRoll(this.testData) {
      let psychicName = this.testData.name;
      this.testData.name = game.i18n.localize(this.testData.skillName);
      await commonRoll(this.testData);
      this.testData.name = psychicName;
      if (this.result.isSuccess && _hasDamage(this.testData)) {
        _rollDamage(this.testData);
        _computeDamageChat(this.testData);
        await _sendDamageToChat(this.testData);
      }
    }
    
    async  damageRoll(this.testData) {
      _rollDamage(this.testData);
      _computeDamageChat(this.testData);
      await _sendDamageToChat(this.testData);
    }
    
  
    _rollDamage(this.testData) {
      let ed = this.testData.weapon.ed.base + this.testData.weapon.ed.bonus;
      let formula = `${ed}d6`;
      let r = new Roll(formula, {});
      r.evaluate();
      this.result.damage = {
        dice: [],
        total: this.testData.weapon.damage.base + this.testData.weapon.damage.bonus
      };
      r.terms.forEach((term) => {
        if (typeof term === 'object' && term !== null) {
          term.results.forEach(result => {
            let die = _computeExtraDice(result.result, this.testData.weapon.ed.die);
            this.result.damage.total += die.value;
            this.result.damage.dice.push(die);
          });
        }
      });
      this.testData.rolls.damage.push(r);
    }
    
  
    
    _computeDamageChat(this.testData) {
      this.result.damage.dice.sort((a, b) => { return b.weight - a.weight });
      if (this.testData.weapon.ap) {
        this.testData.weapon.ap.total = this.testData.weapon.ap.base + this.testData.weapon.ap.bonus;
      }
    }
    
    
    
    _computeExtraDice(dieValue, die) {
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
        name = name,
        value =  value,
        score: dieValue =
        isWrath: fat =e,
        rerollable: false,
        weight: weight
      };
    }
    
    
    _hasDamage(this.testData) {
      let damage = this.testData.weapon.damage.base + this.testData.weapon.damage.bonus;
      let ed = this.testData.weapon.ed.base + this.testData.weapon.ed.bonus;
      return (damage > 0 || ed > 0);
    }
    
    _getRoll(rolls)
    {
      const pool = PoolTerm.fromRolls(rolls);
      return Roll.fromTerms([pool]);
    }
    
    async _sendDamageToChat(this.testData) {
      const html = await renderTemplate("systems/wrath-and-glory/template/chat/damage.html", this.testData);
      let chatData = {
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: _getRoll(this.testData.rolls.damage),
        flags: {this.testData: this.testData},
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
    
  */

}



export class PoolDie extends Die {
  constructor(termData) {
    termData.faces = 6;
    super(termData);
  }

  get isWrath() { return false }

  static DENOMINATION = "p"

  /**@overide */
  roll(...args) {
    let roll = super.roll(...args)
    if (roll.result === 6) {
      roll.name = "icon",
        roll.value = 2,
        roll.rerollable = false,
        roll.weight = 3
    }
    else if (roll.result > 3) {
      roll.name = "success",
        roll.value = 1,
        roll.rerollable = false,
        roll.weight = 2
    }
    else {
      roll.name = "failed",
        roll.value = 0,
        roll.rerollable = true,
        roll.weight = 1
    }
    if (game.modules.get("wng-core") && game.modules.get("wng-core").active)
      roll.img = `modules/wng-core/assets/dice/die-pool-${roll.result}`
    else
      roll.img = `systems/wrath-and-glory/asset/image/die-pool-${roll.result}`
  }


  reroll() {
    // Recursively reroll until there are no remaining results to reroll
    let checked = 0;
    let initial = this.results.length;
    while (checked < this.results.length) {
      let r = this.results[checked];
      checked++;
      if (!r.active) continue;

      // Determine whether to re-roll the result
      if (r.rerollable) {
        r.rerolled = true;
        r.active = false;
        this.roll();
      }

      if ((checked >= initial)) checked = this.results.length;
      if (checked > 1000) throw new Error("Maximum recursion depth for exploding dice roll exceeded");
    }
  }

}



export class WrathDie extends Die {
  constructor(termData) {
    termData.faces = 6;
    super(termData);
  }

  get isWrath() { return true }

  static DENOMINATION = "w"

  /**@overide */
  roll(...args) {
    let roll = super.roll(...args)
    if (roll.result === 6) {
      roll.name = "wrath-critical",
        roll.value = 2,
        roll.rerollable = false,
        roll.weight = -1
    }
    else if (roll.result > 3) {
      roll.name = "wrath-success",
        roll.value = 1,
        roll.rerollable = false,
        roll.weight = -1
    }
    else if (roll.result === 1) {
      roll.name = "wrath-complication",
        roll.value = 0,
        roll.rerollable = false,
        roll.weight = -3
    }
    else {
      roll.name = "wrath-failed",
        roll.value = 0,
        roll.rerollable = true,
        roll.weight = -2
    };
    roll.isWrath = true;
    if (game.modules.get("wng-core") && game.modules.get("wng-core").active)
      roll.img = `modules/wng-core/assets/dice/die-wrath-${roll.result}`
    else
      roll.img = `systems/wrath-and-glory/asset/image/die-wrath-${roll.result}`
  }


  reroll() {
    // Recursively reroll until there are no remaining results to reroll
    let checked = 0;
    let initial = this.results.length;
    while (checked < this.results.length) {
      let r = this.results[checked];
      checked++;
      if (!r.active) continue;

      // Determine whether to re-roll the result
      if (r.rerollable) {
        r.rerolled = true;
        r.active = false;
        this.roll();
      }

      if ((checked >= initial)) checked = this.results.length;
      if (checked > 1000) throw new Error("Maximum recursion depth for exploding dice roll exceeded");
    }
  }
}

export class WNGTest {
  constructor(data = {}) {
    this.data = {
      testData: {
        difficulty: data.difficulty,
        pool: data.pool,
        attribute: data.attribute,
        skill: data.skill,
        wrath: data.wrath,
        shifted : data.shifted || {damage : [], glory : [], other : []}
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

    if(this.result.isWrathCritical && !this.context.gloryAdded)
    {
      this.context.gloryAdded = true
      game.wng.RuinGloryCounter.changeCounter(1,  "glory").then(() => {game.counter.render(true)})
    }

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
      //this.result.rerolledDice = this.result.rerolledDice.filter((die, index) => !this.isShifted(index))

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

    this.result.dice.forEach((die, index) => die.index = index)
    this.result.isWrathCritical = this.result.dice.some(r => r.isWrath && r.result == 6)
    this.result.isWrathComplication = this.result.dice.some(r => r.isWrath && r.result == 1)

    this.result.shifted = this.result.dice.filter(die => this.isShifted(die.index))
    this.result.shifted.forEach(die => {
      if(this.testData.shifted.damage.includes(die.index))
        die.shift = "damage";
      else if(this.testData.shifted.glory.includes(die.index))
        die.shift = "glory";
      else
        die.shift = "other"
    })

    this.result.allDice = duplicate(this.result.dice)
    this.result.dice = this.result.dice.filter(die => !this.isShifted(die.index))
    this.result.success = this.result.dice.reduce((prev, current) => prev + current.value, 0)
    this.result.failure = this.result.dice.reduce((prev, current) => prev + (current.value === 0 ? 1 : 0), 0)
    this.result.shiftsPossible = this._countShifting();
    this.result.isSuccess = this.result.success >= this.result.dn;
  }

  async reroll() {
    this.context.rerolled = true;
    this.rerolledTest = await this.roll.reroll()
    this._computeResult();
    
    if(this.result.isWrathCritical && !this.context.gloryAdded)
    {
      this.context.gloryAdded = true
      game.wng.RuinGloryCounter.changeCounter(1,  "glory").then(() => {game.counter.render(true)})
    }

    if (game.dice3d) {
      let rerollShow = duplicate(this.rerolledTest)
      rerollShow.terms = rerollShow.terms.map((term, t) => {
        if (term.results)
        {
          term.results = term.results.map((die, i) => {
            if (this.roll.terms[t].results[i].rerollable)
              return die
          }).filter(i => i)
        }
        return term
      })

      await game.dice3d.showForRoll(Roll.fromData(rerollShow))
      this.sendToChat()
    }
  }

  shift(shift, type) {

    this.testData.shifted[type] = this.testData.shifted[type].concat(shift)
    this._computeResult()
    this.sendToChat()
  }

  unshift()
  {
    let glorySubtract = -this.testData.shifted.glory.length
    game.wng.RuinGloryCounter.changeCounter(glorySubtract, "glory").then(() => {
        game.counter.render(true)
        ui.notifications.notify(game.i18n.format("COUNTER.GLORY_CHANGED", {change : glorySubtract}))
    })
    //this.result.allDice.filter(die => die.shift).forEach(die => die.shift = "")
    this.testData.shifted.other = []
    this.testData.shifted.damage = []
    this.testData.shifted.glory = []
    this._computeResult()
    this.sendToChat()
  }

  async sendToChat({newMessage = null}={}) {
    const html = await renderTemplate("systems/wrath-and-glory/template/chat/roll.html", this);
    let chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: this.roll,
      flags: { "wrath-and-glory.testData": this.data },
      user: game.user.id,
      rollMode: game.settings.get("core", "rollMode"),
      content: html,
      speaker : this.context.speaker
    };
    if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    } else if (chatData.rollMode === "selfroll") {
      chatData.whisper = [game.user];
    }
    if (newMessage || !this.message)
    {
      return ChatMessage.create(chatData).then(msg => {
        msg.update({"flags.wrath-and-glory.testData.context.messageId" : msg.id})
      });
    }
    else
    {
      delete chatData.roll
      return this.message.update(chatData)
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

  isShifted(dieIndex)
  {
    if(this.testData.shifted.damage.includes(dieIndex))
      return true
    if(this.testData.shifted.glory.includes(dieIndex))
      return true
    if(this.testData.shifted.other.includes(dieIndex))
      return true

    return false
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
    let ed = this.testData.ed.base + this.testData.ed.bonus + this.getRankNum(this.testData.ed.rank) + this.testData.shifted.damage.length;
    let formula = `${ed}dp`;
    let r = new Roll(formula, {});
    r.evaluate({ async: true });
    this.result.damage = {
      total: this.testData.damage.base + this.testData.damage.bonus + this.getRankNum(this.testData.damage.rank),
      ap: this.testData.ap.base + this.testData.ap.bonus + this.getRankNum(this.testData.ap.rank),
      dice: []
    };
    r.terms.forEach((term) => {
      if (typeof term === 'object' && term !== null) {
        term.results.forEach(die => {
          this.result.damage.total += die.value;
          this.result.damage.dice.push(die);
        });
      }
    });
    this.damageRoll = r;
    this.result.damage.roll = r.toJSON()
  }


  async sendDamageToChat() {
    const html = await renderTemplate("systems/wrath-and-glory/template/chat/damage.html", this);
    let chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: this.damageRoll,
      flags: { "wrath-and-glory.testData": this.data },
      user: game.user.id,
      rollMode: game.settings.get("core", "rollMode"),
      content: html,
      speaker : this.context.speaker
    };
    if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    } else if (chatData.rollMode === "selfroll") {
      chatData.whisper = [game.user];
    }
    return ChatMessage.create(chatData);
  }

  get testEffects() {
    if(this.item)
      return this.item.effects.filter(e => !e.data.transfer)
    else 
      return []
  }

  get showEffects() {
    return this.testEffects.length && this.result.isSuccess
  }

  get testData() { return this.data.testData; }
  get context() { return this.data.context; }
  get result() { return this.data.result; }
  get attribute() { return this.actor.attributes[this.data.testData.attribute] }
  get skill() { return this.actor.skills[this.data.testData.skill] }

  get item() { return this.actor.items.get(this.testData.itemId) }
  get actor() { return game.wng.utility.getSpeaker(this.context.speaker) }
  get message() { return game.messages.get(this.context.messageId)}

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
        roll.canShift = true,
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
        roll.canShift = true,
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

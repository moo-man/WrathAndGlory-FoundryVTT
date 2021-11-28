export class WNGTest {
  constructor(data = {}) {
    this.data = {
      testData: {
        difficulty: data.difficulty,
        pool: data.pool,
        attribute: data.attribute,
        skill: data.skill,
        wrath: data.wrath,
        shifted : data.shifted || {damage : [], glory : [], other : []},
        rerolls: [] // Indices of reroll sets
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

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/common/common-roll.html"
  }


  static recreate(data) {
    let test = new game.wng.rollClasses[data.context.rollClass]()
    test.data = data;
    if (test.result.roll)
      test.roll = Roll.fromData(test.result.roll)
    if (test.testData.rerolls.length)
      test.rerolledTests = test.result.rerolls.map(r => Roll.fromData(r))
    if (test.result.damage)
      test.damageRoll = Roll.fromData(test.result.damage.roll)
    return test
  }

  async rollTest() {
    this.result.wrathSize = this.testData.wrath.base > 0 ? this.testData.wrath.base : 1;
    this.result.poolSize = this.testData.pool.size + this.testData.pool.bonus - 1 + this.getRankNum(this.testData.pool.rank);
    await this._rollDice()
    this._computeResult();

    if(this.result.isWrathCritical && !this.context.counterChanged)
    {
      this.context.counterChanged = true
      if (this.actor.type == "agent")
        game.wng.RuinGloryCounter.changeCounter(1,  "glory").then(() => {game.counter.render(true)})
      else if (this.actor.type == "threat")
        game.wng.RuinGloryCounter.changeCounter(1,  "ruin").then(() => {game.counter.render(true)})
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
    this.result.dn = this.testData.difficulty.target + this.testData.difficulty.penalty - this.getRankNum(this.testData.difficulty.rank);
    this.result.roll = this.roll.toJSON()
    this.result.dice = this.roll.dice.reduce((prev, current) => prev.concat(current.results), [])
    if (this.testData.rerolls.length) {
      this.result.rerolls = this.rerolledTests.map(r => r.toJSON()) // save roll objects for recreation
      this.result.rerolledDice = [] 
      for (let reroll of this.rerolledTests)
        this.result.rerolledDice.push(reroll.dice.reduce((prev, current) => prev.concat(current.results.map(i => { i.rerolled = true; return i })), []))

      // Merge rerolls and roll - For each reroll set, take the corresponding reroll indices and keep the dice that the indices indicate
      for(let i = 0; i < this.result.rerolledDice.length; i++)
      {
        let rerollDice = this.result.rerolledDice[i]
        let shouldRerollSet = this.testData.rerolls[i]
        this.result.dice = this.result.dice.reduce((prev, current, i) => {
          if (shouldRerollSet.includes(i))
            prev.push(rerollDice[i])
          else {
            prev.push(current)
          }
          return prev
        }, [])
      }
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

  async reroll(diceIndices) {

    this.testData.rerolls.push(diceIndices)
    if (!this.rerolledTests)
      this.rerolledTests = []
    this.rerolledTests.push(await this.roll.reroll())
    this._computeResult();

    if (game.dice3d) {
      let rerollShow = duplicate(this.rerolledTests[this.rerolledTests.length-1])
      rerollShow.terms = rerollShow.terms.map((term, t) => {
        if (term.results)
        {
          term.results = term.results.map((die, i) => {
            if (diceIndices.includes(this.roll.terms[t].results[i].index))
            return die
          }).filter(i => i)
        }
        return term
      })
      await game.dice3d.showForRoll(Roll.fromData(rerollShow))
    }
      
    this.sendToChat()
  }

  async rerollFailed() {
    this.context.rerollFailed = true;
    let reroll = [] // Reroll indices
      
    // If rerollable, record index of die
    this.result.dice.forEach((die) => {
      if(die.rerollable)
        reroll.push(die.index)
    })

    await this.reroll(reroll)

    if(this.result.isWrathCritical && !this.context.counterChanged)
    {
      this.context.counterChanged = true
      if (this.actor.type == "agent")
        game.wng.RuinGloryCounter.changeCounter(1,  "glory").then(() => {game.counter.render(true)})
      else if (this.actor.type == "threat")
          game.wng.RuinGloryCounter.changeCounter(1,  "ruin").then(() => {game.counter.render(true)})
    }

  }

  clearRerolls() {
    this.testData.rerolls = []
    this.result.rerolls = []
    this.context.rerollFailed = false
    this._computeResult();
    this.sendToChat()
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
        if (glorySubtract)
          ui.notifications.notify(game.i18n.format("COUNTER.GLORY_CHANGED", {change : glorySubtract}))
    })
    //this.result.allDice.filter(die => die.shift).forEach(die => die.shift = "")
    this.testData.shifted.other = []
    this.testData.shifted.damage = []
    this.testData.shifted.glory = []
    this._computeResult()
    this.sendToChat()
  }

  // Is this test shiftable?
  isShiftable() {
    return true
  }

  async sendToChat({newMessage = null}={}) {
    const html = await renderTemplate(this.template, this);
    let chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: this.roll,
      flags: { "wrath-and-glory.testData": this.data },
      user: game.user.id,
      rollMode: game.settings.get("core", "rollMode"),
      content: html,
      speaker : this.context.speaker
    };
    chatData.speaker.alias = this.actor.name
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

  // Update message data without rerendering the message content
  updateMessageFlags(){
    return this.message.update({"flags.wrath-and-glory.testData" : this.data})
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
    let values = this.testData.ed.damageValues

    let r = Roll.fromTerms([
      new PoolDie({ number: ed, faces: 6, options : {values} }),
    ])

    r.evaluate({ async: true });
    this.result.damage = {
      total: this.testData.damage.base + this.testData.damage.bonus + this.getRankNum(this.testData.damage.rank),
      ap: (this.testData.ap.base + this.testData.ap.bonus + this.getRankNum(this.testData.ap.rank)) || 0,
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
    const html = await renderTemplate("systems/wrath-and-glory/template/chat/roll/damage/damage-roll.html", this);
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

  get doesDamage() {
        return (this.testData.damage && (this.testData.damage.base || this.testData.damage.bonus || this.testData.damage.rank != "none")) || (this.testData.ed && (this.testData.ed.base || this.testData.ed.bonus || this.testData.ed.rank != "none"))
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

  get showTest() {
    return this.result.isSuccess && this.item && this.item.hasTest 
  }

  get testDisplay() {
    if (this.showTest)
    {
      if (this.item.test.type == "attribute")
        return `DN ${this.item.test.dn} ${game.wng.config.attributes[this.item.test.specification]} Test`
      if (this.item.test.type == "skill")
        return `DN ${this.item.test.dn} ${game.wng.config.skills[this.item.test.specification]} (${game.wng.config.attributeAbbrev[game.wng.config.skillAttribute[this.item.test.specification]]}) Test`
      if (this.item.test.type == "resolve")
        return `DN ${this.item.test.dn} ${game.wng.config.resolveTests[this.item.test.specification]} Test`
        if (this.item.test.type == "conviction")
        return `DN ${this.item.test.dn} ${game.wng.config.convictionTests[this.item.test.specification]} Test`
    }
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
    if (!termData.options || !termData.options.values)
      setProperty(termData, "options.values", {1 : 0,2 : 0,3 : 0,4 : 1,5 : 1,6 : 2})
    super(termData);
  }

  get isWrath() { return false }

  static DENOMINATION = "p"

  /**@overide */
  roll(...args) {
    let roll = super.roll(...args)
    roll.value = this.options.values[roll.result]
    if (roll.result === 6) {
      roll.name = "icon",
        roll.canShift = true,
        roll.rerollable = false,
        roll.weight = 3
    }
    else if (roll.result > 3) {
      roll.name = "success",
        roll.rerollable = false,
        roll.weight = 2
    }
    else {
      roll.name = "failed",
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

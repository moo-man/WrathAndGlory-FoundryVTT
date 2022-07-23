export class WNGTest {
  constructor(data = {}) {
    this.data = {
      testData: {
        difficulty: data.difficulty,
        pool: data.pool,
        attribute: data.attribute,
        skill: data.skill,
        wrath: data.wrath,
        shifted: data.shifted || { damage: [], glory: [], other: [], potency: [] },
        rerolls: [], // Indices of reroll sets,
        useDN: true
      },
      context: {
        title: data.title,
        targets: data.targets ? data.targets.map(i => i.document.toObject()) || [] : [],
        type: data.type,
        speaker: data.speaker,
        rollClass: this.constructor.name,
        rerolled: data.rerolled || false,
        edit: { pool: 0, wrath: 0, icons: 0, damage: 0, ed: 0, ap: 0 }
      },
      result: {}
    }
  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/common/common-roll.html"
  }

  get damageTemplate() {
    return "systems/wrath-and-glory/template/chat/roll/damage/damage-roll.html"
  }

  static recreate(data) {
    if (!data.context) {
      return;
    }

    let test = new game.wng.rollClasses[data.context.rollClass]()
    test.data = data;
    if (test.result.roll)
      test.roll = Roll.fromData(test.result.roll)
    if (test.testData.rerolls.length)
      test.rerolledTests = test.result.rerolls.map(r => Roll.fromData(r))
    if (test.result.damage?.roll)
      test.damageRoll = Roll.fromData(test.result.damage.roll)
    return test
  }

  async rollTest() {
    // Total dice in the test
    let diceNum = this.testData.pool.size + this.testData.pool.bonus + this.getRankNum(this.testData.pool.rank);

    // Wrath = wrath value inputted, but can't be above total number of dice, and can't be negative
    this.result.wrathSize = this.testData.wrath.base < 0 ? 0 : Math.min(this.testData.wrath.base, diceNum);

    // Leftover, if any, is pool dice
    this.result.poolSize = Math.max(diceNum - this.result.wrathSize, 0)

    await this._rollDice()
    this._computeResult();

    this.handleCounters();

    return this

  }

  _rollDice() {

    this.roll = Roll.fromTerms([
      new PoolDie({ number: this.result.poolSize, faces: 6 }),
      new OperatorTerm({ operator: "+" }),
      new WrathDie({ number: this.result.wrathSize, faces: 6 })
    ])

    return this.roll.evaluate({ async: true });
  }

  _computeResult() {
    this.data.result = {}
    this.result.dn = (this.testData.useDN) ? this.testData.difficulty.target + this.testData.difficulty.penalty - this.getRankNum(this.testData.difficulty.rank) : 0;
    this.result.roll = this.roll.toJSON();
    this.result.dice = this.roll.dice.reduce((prev, current) => prev.concat(current.results), []);

    if (this.testData.rerolls.length) {
      this._computeReroll();
    }

    // Set dice indices before filtering out shifted
    this.result.dice.forEach((die, index) => die.index = index);

    this._computeShifted()

    // Compute wrath before filtering out shifted dice

    this._handleWrath()

    this.result.allDice = duplicate(this.result.dice);
    this.result.dice = this.result.dice.filter(die => !this.isShifted(die.index));
    this.result.success = this.result.dice.reduce((prev, current) => prev + current.value, 0) + this.context.edit.icons;
    this.result.failure = this.result.dice.reduce((prev, current) => prev + (current.value === 0 ? 1 : 0), 0);
    this.result.shiftsPossible = (this.isShiftable) ? this._countShifting() : 0;
    this.result.isSuccess = this.result.success >= this.result.dn;
    if (this.result.isWrathCritical)
      this.result.isWrathCritical = this.result.isWrathCritical && this.result.isSuccess // Only critical if test is successful
  }

  _computeReroll() {
    this.result.rerolls = this.rerolledTests.map(r => r.toJSON()); // save roll objects for recreation
    this.result.rerolledDice = [];
    for (let reroll of this.rerolledTests)
      this.result.rerolledDice.push(reroll.dice.reduce((prev, current) => prev.concat(current.results.map(i => {
        i.rerolled = true;
        return i;
      })), []))

    // Merge rerolls and roll - For each reroll set, take the corresponding reroll indices and keep the dice that the indices indicate
    for (let i = 0; i < this.result.rerolledDice.length; i++) {
      let rerollDice = this.result.rerolledDice[i];
      let shouldRerollSet = this.testData.rerolls[i];
      this.result.dice = this.result.dice.reduce((prev, current, i) => {
        if (shouldRerollSet.includes(i)) {
          prev.push(rerollDice[i]);
        } else {
          prev.push(current);
        }
        return prev;
      }, [])
    }
  }

  _handleWrath() {
    this.result.isWrathComplication = this.result.dice.some(r => r.isWrath && r.result === 1);

    if (this.actor.hasCondition("dying")) {
      this.result.isWrathCritical = this.result.dice.every(r => r.isWrath && r.result === 6);
      this.result.gainTraumaticInjury = this.result.isWrathComplication
      return;
    }

    this.result.isWrathCritical = this.result.dice.some(r => r.isWrath && r.result === 6);
  }

  _computeShifted() {
    this.result.shifted = this.result.dice.filter(die => this.isShifted(die.index));
    this.result.shifted.forEach(die => {
      if (this.testData.shifted.damage.includes(die.index))
        die.shift = "damage";
      else if (this.testData.shifted.glory.includes(die.index))
        die.shift = "glory";
      else if (this.testData.shifted.potency.includes(die.index))
        die.shift = "potency"
      else
        die.shift = "other";
    })
  }

  async reroll(diceIndices) {

    this.testData.rerolls.push(diceIndices)
    if (!this.rerolledTests)
      this.rerolledTests = []
    this.rerolledTests.push(await this.roll.reroll())
    this._computeResult();

    if (game.dice3d) {
      let rerollShow = duplicate(this.rerolledTests[this.rerolledTests.length - 1])
      rerollShow.terms = rerollShow.terms.map((term, t) => {
        if (term.results) {
          term.results = term.results.map((die, i) => {
            if (diceIndices.includes(this.roll.terms[t].results[i]?.index))
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
      if (die.rerollable)
        reroll.push(die.index)
    })

    await this.reroll(reroll)
    this.handleCounters();
  }

  async _addDice({ pool = 0, wrath = 0 } = {}) {
    let poolDice
    let wrathDice
    let removePool = 0;
    let removeWrath = 0;

    if (pool > 0)
      poolDice = new PoolDie({ number: pool, faces: 6 })
    if (wrath > 0)
      wrathDice = new WrathDie({ number: wrath, faces: 6 })

    let added
    if (poolDice || wrathDice) {
      added = Roll.fromTerms([
        poolDice, wrathDice
      ].filter(d => d))
    }

    if (pool < 0) {
      removePool = Math.abs(pool);
    }
    if (wrath < 0) {
      removeWrath = Math.abs(wrath)
    }

    // Dice removed previously still show up (Terms with no results) So remove terms that have no results
    let oldTerms = this.roll.toJSON().terms.filter(t => t instanceof OperatorTerm || t.results.length > 0);


    // Find the last term of what is being deleted, and delete dice from that term
    // Example: Normal dice rolls will look like [PoolDieTerm, Operator, WrathDieTerm]
    // But, the user previously added dice, it will look like [PoolDieTerm, Operator, WrathDieTerm, PoolDieTerm]
    // If the user wants to then delete PoolDie, it should be deleted from the last PoolDieTerm, not the first

    // TODO: Known issue that if you delete more than the last term, it doesn't carry over to the next term
    // Example: Previously added 2 Pool Dice, which creates another Pool DiceTerm at the end of the Roll object. 
    // Then, you delete 4 Pool Dice. This will result in deleting only the 2 Pool Dice at the end
    if (removePool) {
      let lastPoolTerm = oldTerms.slice().reverse().find(t => t instanceof DiceTerm && !t.isWrath) // Need instanceof because don't want to find OperatorTerms
      if (lastPoolTerm)
        lastPoolTerm.results = lastPoolTerm.results.slice(0, lastPoolTerm.results.length - removePool)

    }

    if (removeWrath) {
      let lastWrathTerm = oldTerms.slice().reverse().find(t => t instanceof DiceTerm && t.isWrath) // Need instanceof because don't want to find OperatorTerms
      if (lastWrathTerm)
        lastWrathTerm.results = lastWrathTerm.results.slice(0, lastWrathTerm.results.length - removePool)
    }

    let connector

    // Only add a connecting operator term if dice were added (don't want trailing "+")
    if (added) {
      await added.evaluate({ async: true });
      connector = await new OperatorTerm({ operator: "+" }).evaluate({ async: true });
      if (game.dice3d)
        await game.dice3d.showForRoll(added)
    }

    let newRoll = oldTerms.concat(connector || []).concat(added?.terms || [])


    // Foundry throws an error if the last term is an operator term
    if (newRoll[newRoll.length - 1] instanceof OperatorTerm) {
      newRoll.splice(newRoll.length - 1, 1);
    }

    this.roll = Roll.fromTerms(newRoll)
  }


  async edit({ pool = 0, wrath = 0, icons = 0 } = {}) {
    this.context.edit.icons += icons;
    this.context.edit.pool += pool;
    this.context.edit.wrath += wrath;
    if (pool || wrath)
      await this._addDice({ pool, wrath })

    this._computeResult();
    this.sendToChat();
  }


  handleCounters() {
    if (this.result.isWrathCritical && !this.context.counterChanged && this.actor.getFlag("wrath-and-glory", "generateMetaCurrencies")) {
      this.context.counterChanged = true
      if (this.actor.type == "agent")
        game.wng.RuinGloryCounter.changeCounter(1, "glory").then(() => { game.counter.render(true) })
      else if (this.actor.type == "threat")
        game.wng.RuinGloryCounter.changeCounter(1, "ruin").then(() => { game.counter.render(true) })
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

  unshift() {
    let glorySubtract = -this.testData.shifted.glory.length
    game.wng.RuinGloryCounter.changeCounter(glorySubtract, "glory").then(() => {
      game.counter.render(true)
      if (glorySubtract)
        ui.notifications.notify(game.i18n.format("COUNTER.GLORY_CHANGED", { change: glorySubtract }))
    })
    //this.result.allDice.filter(die => die.shift).forEach(die => die.shift = "")
    this.testData.shifted.other = []
    this.testData.shifted.damage = []
    this.testData.shifted.glory = []
    this.testData.shifted.potency = []
    this._computeResult()
    this.sendToChat()
  }

  // Is this test shiftable?
  isShiftable() {
    return true
  }

  async sendToChat({ newMessage = null, chatDataMerge = {} } = {}) {
    const html = await renderTemplate(this.template, this);
    let chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: this.roll,
      flags: { "wrath-and-glory.testData": this.data },
      user: game.user.id,
      rollMode: game.settings.get("core", "rollMode"),
      content: html,
      speaker: this.context.speaker
    };
    chatData.speaker.alias = this.actor.token ? this.actor.token.name : this.actor.prototypeToken.name
    if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    } else if (chatData.rollMode === "selfroll") {
      chatData.whisper = [game.user];
    }
    if (newMessage || !this.message) {
      return ChatMessage.create(chatData).then(msg => {
        msg.update({ "flags.wrath-and-glory.testData.context.messageId": msg.id })
      });
    }
    else {
      delete chatData.roll
      return this.message.update(chatData)
    }
  }

  // Update message data without rerendering the message content
  updateMessageFlags() {
    if (this.message)
      return this.message.update({ "flags.wrath-and-glory.testData": this.data })
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

  isShifted(dieIndex) {
    if (this.testData.shifted.damage.includes(dieIndex))
      return true
    if (this.testData.shifted.glory.includes(dieIndex))
      return true
    if (this.testData.shifted.potency.includes(dieIndex))
      return true
    if (this.testData.shifted.other.includes(dieIndex))
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

  /**
   * Set Base values for damage, before any rolling
   */
  computeDamage() {
    this.result.damage = {
      ed: {},
      ap: (this.testData.ap.base + this.testData.ap.bonus + this.getRankNum(this.testData.ap.rank) + this.context.edit.ap) || 0,
      dice: [],
      flat: this.testData.damage.base + this.testData.damage.bonus + this.getRankNum(this.testData.damage.rank),
      total: 0,
      other: duplicate(this.testData.otherDamage || {})
    }
    this.result.damage.total = this.result.damage.flat + this.context.edit.damage
    this.result.damage.ed = { number: this.testData.ed.base + this.testData.ed.bonus + this.getRankNum(this.testData.ed.rank) + this.testData.shifted.damage.length + this.context.edit.ed };
    this.result.damage.ed.values = this.testData.ed.damageValues
  }

  async rollDamage() {

    this.result.damage.total = this.result.damage.flat + this.context.edit.damage
    this.result.damage.dice = [];

    let add = 0
    if (this.weapon && this.weapon.traitList.rad)
      add = this.weapon.traitList.rad.rating


    let damage = this.result.damage


    // Don't like this but will work for now
    if (this.weapon && this.weapon.traitList.melta && this.result.range == "short") {
      damage.ed.values = {
        1: 0,
        2: 0,
        3: 1,
        4: 1,
        5: 2,
        6: 2
      }
    }

    let r = Roll.fromTerms([
      new PoolDie({ number: damage.ed.number, faces: 6, options: { values: damage.ed.values, add } }),
    ])

    await r.evaluate({ async: true });
    r.terms.forEach((term) => {
      if (typeof term === 'object' && term !== null) {
        term.results.forEach(die => {
          this.result.damage.total += die.value;
          this.result.damage.dice.push(die);
        });
      }
    });

    // Other Damage
    for (let damage in this.result.damage.other) {
      if (this.result.damage.other[damage].value)
        this.result.damage.other[damage].total = (await new Roll(this.result.damage.other[damage].value).evaluate({ async: true })).total + this.result.damage.other[damage].bonus
      else if (this.result.damage.other[damage].bonus)
        this.result.damage.other[damage].total = this.result.damage.other[damage].bonus

    }

    this.damageRoll = r;
    this.result.damage.roll = r.toJSON()
    this.updateMessageFlags()
    this.sendDamageToChat()
  }


  async sendDamageToChat() {
    const html = await renderTemplate(this.damageTemplate, this);
    let chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: this.damageRoll,
      flags: { "wrath-and-glory.testData": this.data },
      user: game.user.id,
      rollMode: game.settings.get("core", "rollMode"),
      content: html,
      speaker: this.context.speaker
    };
    if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
      chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    } else if (chatData.rollMode === "selfroll") {
      chatData.whisper = [game.user];
    }
    return ChatMessage.create(chatData);
  }


  // Need a specialized function to account for both item and ammo effects
  getEffect(effectId) {
    return this.testEffects.find(e => e.id == effectId)
  }

  get doesDamage() {
    return (this.testData.damage && (this.testData.damage.base || this.testData.damage.bonus || this.testData.damage.rank != "none")) || (this.testData.ed && (this.testData.ed.base || this.testData.ed.bonus || this.testData.ed.rank != "none"))
  }

  get testEffects() {
    if (this.item) {
      let effects = this.item.effects.filter(e => !e.data.transfer)
      if (this.item.isRanged && this.item.Ammo)
        effects = effects.concat(this.item.Ammo.ammoEffects)
      return effects
    }
    else
      return []
  }

  get showEffects() {
    return this.testEffects.length && this.result.isSuccess
  }

  get showTest() {
    return this.result.isSuccess && this.result.test
  }

  get testDisplay() {
    if (this.showTest) {
      if (this.result.test.type == "attribute")
        return `DN ${this.result.test.dn} ${game.wng.config.attributes[this.result.test.specification]} Test`
      if (this.result.test.type == "skill")
        return `DN ${this.result.test.dn} ${game.wng.config.skills[this.result.test.specification]} (${game.wng.config.attributeAbbrev[game.wng.config.skillAttribute[this.result.test.specification]]}) Test`
      if (this.result.test.type == "resolve")
        return `DN ${this.result.test.dn} ${game.wng.config.resolveTests[this.result.test.specification]} Test`
      if (this.result.test.type == "corruption")
        return `DN ${this.result.test.dn} Corruption Test`
    }
  }

  get testData() { return this.data.testData; }
  get context() { return this.data.context; }
  get result() { return this.data.result; }
  get attribute() { return this.actor.attributes[this.data.testData.attribute] }
  get skill() { return this.actor.skills[this.data.testData.skill] }

  get item() { return this.actor.items.get(this.testData.itemId) }
  get actor() { return game.wng.utility.getSpeaker(this.context.speaker) }
  get message() { return game.messages.get(this.context.messageId) }

}



export class PoolDie extends Die {
  constructor(termData) {
    termData.faces = 6;
    if (!termData.options || !termData.options.values)
      setProperty(termData, "options.values", { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 2 })
    if (!termData.options || !termData.options.add)
      setProperty(termData, "options.add", 0)
    super(termData);
  }

  get isWrath() { return false }

  static DENOMINATION = "p"

  /**@overide */
  roll(...args) {
    let roll = super.roll(...args)
    roll.value = this.options.values[Math.min(roll.result + this.options.add, 6)]
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
      roll.img = `modules/wng-core/assets/dice/die-pool-${roll.result}.webp`
    else
      roll.img = `systems/wrath-and-glory/asset/image/die-pool-${roll.result}.webp`
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
      roll.img = `modules/wng-core/assets/dice/die-wrath-${roll.result}.webp`
    else
      roll.img = `systems/wrath-and-glory/asset/image/die-wrath-${roll.result}.webp`
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

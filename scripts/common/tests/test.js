import { DamageModel } from "../../model/item/components/damage";
import { DamageRoll } from "./damage";

export class WNGTest extends WarhammerTestBase {
  static rollFunction = "rollTest";

  constructor(data = {}) {
    super();
    this.data = {
      testData: {
        difficulty: data.difficulty,
        pool: data.pool,
        attribute: data.attribute,
        skill: data.skill,
        wrath: data.wrath,
        shifted: data.shifted || { damage: {
          label : game.i18n.localize("SHIFT.DAMAGE"),
          dice : [],
          letter : "D"
        }, glory: {
          label : game.i18n.localize("SHIFT.GLORY"),
          dice : [],
          letter : "G"
        }, other: {
          label : game.i18n.localize("SHIFT.OTHER"),
          dice : [],
          letter : "?"
        }, potency: {
          label : game.i18n.localize("SHIFT.POTENCY"),
          dice : [],
          letter : "P"
        }},
        // shifted: data.shifted || { damage: [], glory: [], other: [], potency: [], added: {} },
        rerolls: [], // Indices of reroll sets,
        useDN: true,
        itemId : data.item?.uuid,
        edit: { pool: 0, wrath: 0, icons: 0, damage: 0, ed: 0, ap: 0 },
      },
      context: {
        title: data.context?.title,
        targets: data.targets || [],
        type: data.type,
        breakdown : data.context?.breakdown,
        speaker: data.speaker,
        rollClass: this.constructor.name,
        rollMode : data.rollMode,
        rerolled: data.rerolled || false,
      },
      result: {
        text : {

        }
      },
      class: this.constructor.name
    }

    if (this.item?.system.damage?.enabled)
    {
      this.addDamageData(this.item.system.damage);
    }
  }

  get template() {
    return "systems/wrath-and-glory/templates/chat/roll/common/common-roll.hbs"
  }

  static recreate(data) {
    if (!data.context) {
      return;
    }

    let test = new game.wng.rollClasses[data.context.rollClass]()
    test.data = data.toJSON?.() || data;
    if (test.result.roll)
      test.roll = Roll.fromData(test.result.roll)
    if (test.testData.rerolls.length)
      test.rerolledTests = test.result.rerolls.map(r => Roll.fromData(r))
    if (test.result.damage?.roll)
      test.damageRoll = Roll.fromData(test.result.damage.roll)
    return test
  }

  async runPreScripts()
  {
      await super.runPreScripts();
      await Promise.all(this.item?.runScripts("preRollTest", this) || []);
  }

  async runPostScripts()
  {
      await super.runPostScripts();
      await Promise.all(this.item?.runScripts("rollTest", this) || []);
  }

  addDamageData(data)
  {
    if (data instanceof DamageModel)
    {
      this.testData.damage = {
        base : data.base,
        ed : {value : data.ed.base + data.ed.bonus + (data.ed.rank * (this.actor.system.advances?.rank || 0)), dice : data.ed.dice},
        ap : {value : data.ap.base + data.ed.bonus + (data.ap.rank * (this.actor.system.advances?.rank || 0)), dice : data.ap.dice},
        damageDice : data.damageDice,
        other : data.otherDamage
      }
    }
    else // From a Dialog
    {
      this.testData.damage = {
        base : data.damage,
        ed : data.ed,
        ap : data.ap,
        damageDice : data.damageDice,
        other : this.item.system.damage.otherDamage
      }
    }
  }

  static fromData(data)
  {
    return new this(data);
  }

  async rollTest() {
    await this.runPreScripts()
    // Total dice in the test
    let diceNum = this.testData.pool

    // Wrath = wrath value inputted, but can't be above total number of dice, and can't be negative
    this.result.wrathSize = this.testData.wrath < 0 ? 0 : Math.min(this.testData.wrath, diceNum);

    // Leftover, if any, is pool dice
    this.result.poolSize = Math.max(diceNum - this.result.wrathSize, 0)

    await this._rollDice()
    this._computeResult();

    this.handleCounters();
    await this.runPostScripts();

    return this

  }

  _rollDice() {

    this.roll = Roll.fromTerms([
      new PoolDie({ number: this.result.poolSize, faces: 6 }),
      new OperatorTerm({ operator: "+" }),
      new WrathDie({ number: this.result.wrathSize, faces: 6 })
    ])

    return this.roll.evaluate();
  }

  _computeResult() {
    this.data.result = {text : {}}
    this.result.dn = (this.testData.useDN) && this.testData.difficulty
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
    this.result.success = this.result.dice.reduce((prev, current) => prev + current.value, 0) + this.testData.edit.icons;
    this.result.failure = this.result.dice.reduce((prev, current) => prev + (current.value === 0 ? 1 : 0), 0);
    this.result.shiftsPossible = (this.isShiftable) ? this._countShifting() : 0;
    this.result.isSuccess = this.result.success >= this.result.dn;
    if (this.result.isWrathCritical)
      this.result.isWrathCritical = this.result.isWrathCritical && this.result.isSuccess // Only critical if test is successful

    if (this.result.isSuccess)
      this.computeDamage() 

    if (this.item?.hasTest && !this.item.system.test.self) this.result.test = duplicate(this.item.test);

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

    /**
    * Set Base values for damage
    */
  computeDamage() {
    if (this.testData.damage)
    {

      this.result.damage = foundry.utils.deepClone({
        damage : this.testData.damage.base + this.testData.edit.damage,
        ed : { value : this.testData.damage.ed.value + this.testData.shifted.damage.dice.length + this.testData.edit.ed, dice : this.testData.damage.ed.dice},
        ap : { value : this.testData.damage.ap.value + this.testData.edit.ap, dice : this.testData.damage.ap.dice},
        damageDice : this.testData.damage.damageDice,
        other : this.testData.damage.other || this.item?.system?.damage.otherDamage,
        bonus : {
          shock : 0, 
          mortal : 0,
          wounds : 0,
        }
      })
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

      for(let type in this.testData.shifted)
      {
        if (this.testData.shifted[type].dice.includes(die.index))
        {
          die.shifted = this.testData.shifted[type];
        }
      }
    })
  }

  async reroll(diceIndices) {

    this.testData.rerolls.push(diceIndices)
    if (!this.rerolledTests)
      this.rerolledTests = []
    this.rerolledTests.push(await this.roll.reroll({async: true}))
    this._computeResult();

    if (game.dice3d) {
      let rerollShow = duplicate(this.rerolledTests[this.rerolledTests.length - 1])
      rerollShow.terms = rerollShow.terms.map((term, t) => {
        if (term.results) {
          term.results = term.results.map((die, i) => {
            if (diceIndices.includes(this.roll.terms[t].results?.[i]?.index))
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
    if (poolDice && wrathDice) {
      added = Roll.fromTerms([
        poolDice, new OperatorTerm({operator : "+"}), wrathDice
      ].filter(d => d))
    }
    else 
    {
      added = Roll.fromTerms([poolDice || wrathDice]);
    }

    if (pool < 0) {
      removePool = Math.abs(pool);
    }
    if (wrath < 0) {
      removeWrath = Math.abs(wrath)
    }

    // Dice removed previously still show up (Terms with no results) So remove terms that have no results
    let oldTerms = foundry.utils.deepClone(this.roll.terms).filter(t => t instanceof OperatorTerm || t.results.length > 0);




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

    // For some reason operator terms aren't evaluated but they are required to be to use fromTerms?
    for(let term of newRoll)
      {
        if (!term._evaluated)
        {
          await term.evaluate();
        }
      }
    this.roll = Roll.fromTerms(newRoll)
  }


  async edit({ pool = 0, wrath = 0, icons = 0 } = {}) {
    this.testData.edit.icons += icons;
    this.testData.edit.pool += pool;
    this.testData.edit.wrath += wrath;
    if (pool || wrath)
      await this._addDice({ pool, wrath })

    this._computeResult();
    this.sendToChat();
  }

  addShiftOption(key, label, letter)
  {
    this.testData.shifted[key] = {dice : [], letter, label}
  }


  handleCounters() {
    if (this.result.isWrathCritical && !this.context.counterChanged && this.actor.getFlag("wrath-and-glory", "generateMetaCurrencies")) {
      this.context.counterChanged = true
      if (this.actor.type == "agent")
        game.wng.RuinGloryCounter.changeCounter(1, "glory").then(() => { game.counter.render({force: true}) })
      else if (this.actor.type == "threat")
        game.wng.RuinGloryCounter.changeCounter(1, "ruin").then(() => { game.counter.render({force: true}) })
    }
  }

  clearRerolls() {
    this.testData.rerolls = []
    this.result.rerolls = []
    this.context.rerollFailed = false
    this._computeResult();
    this.sendToChat()
  }


  async shift(shift, type) 
  {
    if (type == "other" && Object.keys(this.testData.shifted).length > 4)
    {
      type = await this.promptShiftType()
    }

    this.testData.shifted[type].dice = this.testData.shifted[type].dice.concat(shift)
    this._computeResult()
    this.sendToChat()
  }

  unshift() {
    if (this.testData.shifted.glory.dice.length)
    {
      let glorySubtract = -this.testData.shifted.glory.dice.length
      game.wng.RuinGloryCounter.changeCounter(glorySubtract, "glory").then(() => {
        game.counter.render({force: true})
        if (glorySubtract)
          ui.notifications.notify(game.i18n.format("COUNTER.GLORY_CHANGED", { change: glorySubtract }))
      })
      //this.result.allDice.filter(die => die.shift).forEach(die => die.shift = "")
    }
    for(let option of Object.values(this.testData.shifted))
    {
      option.dice = [];
    }
    this._computeResult()
    this.sendToChat()
  }

  // Is this test shiftable?
  get  isShiftable() {
    return true
  }

  async promptShiftType()
  {
    let options = Object.keys(this.testData.shifted).filter(i => !["damage", "potency", "glory"].includes(i)).map(id => {
      return {
        id,
        name : this.testData.shifted[id].label,
        img : "modules/wng-core/assets/dice/die-pool-6.webp"
      }
    })
    return (await ItemDialog.create(options, 1, {title : "Shift Options"}))[0].id
  }

  async sendToChat({ newMessage = null, chatDataMerge = {} } = {}) {
    const html = await renderTemplate(this.template, this);
    let chatData = {
      _id : randomID(),
      type: "test",
      rolls: [this.roll],
      system: this.data,
      user: game.user.id,
      rollMode: this.context.rollMode,
      content: html,
      speaker: this.context.speaker
    };
    chatData.speaker.alias = this.actor.token ? this.actor.token.name : this.actor.prototypeToken.name
    ChatMessage.applyRollMode(chatData, chatData.rollMode);

    if (newMessage || !this.message) 
    {
      this.context.messageId = chatData._id
      await ChatMessage.create(chatData, {keepId : true});
    }
    else {
      delete chatData.roll
      return this.message.update(chatData)
    }
  }

  // Update message data without rerendering the message content
  updateMessageFlags() {
    if (this.message)
      return this.message.update({ system: this.data })
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
    return Object.values(this.testData.shifted).some(option => option.dice.includes(dieIndex));
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
    let damage = DamageRoll.fromTest(this);
    await damage.rollTest();
    this.result.damageRoll = damage.context.messageId;
    this.updateMessageFlags()
  }

  get hasRerolled()
  {
    return this.testData.rerolls?.length
  }


  _formatBreakdown(breakdown)
  {
      breakdown.modifiersBreakdown = `<hr><p>${game.i18n.localize("DIALOG.MODIFIER_BREAKDOWN")}</p>${breakdown.modifiersBreakdown}`;
      return Object.values(breakdown).join("");
  }

  get doesDamage() {
    return this.testData.damage;
  }

  get showTest() {
    let effects = this.targetEffects.concat(this.damageEffects).concat(this.areaEffects)

    // Effects already prompt a test
    if (effects.some(e => e.system.transferData.avoidTest.value == "item"))
    {
      return false;
    }
    else
    {
      return this.result.isSuccess && this.result.test
    }
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
  get skill() { return this.actor.system.skills[this.data.testData.skill] }

  get item() { return fromUuidSync(this.testData.itemId) }
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
  async roll(...args) {
    let roll = await super.roll(...args)
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
    roll.img = game.wng.config.dicePath.concat("die-pool-" + roll.result + ".webp");
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
  async roll(...args) {
    let roll = await super.roll(...args)
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
    roll.img = game.wng.config.dicePath.concat("die-wrath-" + roll.result + ".webp");

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

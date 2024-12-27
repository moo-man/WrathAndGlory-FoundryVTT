import { PoolDie } from "./test";

export class DamageRoll {
  constructor(data) {
    this.data = data
    if (this.result.roll)
      this.roll = Roll.fromData(this.result.roll)
    this.rerolledDamage = this.rerollData.rerolls.map(i => Roll.fromData(i));
  }

  static fromTest(test)
  {
    return new this({
      damageData : test.result.damage,
      context : {
        title : test.context.title,
        targets : test.context.targets,
        speaker : test.context.speaker,
        source : test.message?.id,
        itemId : test.testData.itemId
      },
      rerollData : {
        indices : [],
        rerolls : []
      },
      result : {

      }
    })
  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/damage/damage-roll.hbs"
  }

  async rollTest() {
    // Total dice in the test
    let result = {
      base: this.damageData.damage,
      ed: this.damageData.ed.value,
      ap: this.damageData.ap.value,
      total: this.damageData.damage,
      other : {
        mortal : 0,
        wounds:  0,
        shock :  0
      }
    }

    let modifiers = {
      damage : [],
      ed : [],
      ap : [],
      wounds : [],
      mortal : [],
      shock: []
    }

    await Promise.all(this.actor.runScripts("preComputeDamage", {damage : this.data.result, roll : this, test : this.source?.system.test, modifiers}) || []);
    await Promise.all(this.item?.runScripts("preComputeDamage", {damage : this.data.result, roll : this, test : this.source?.system.test, modifiers}) || []);

    this.result.ed += modifiers.ed.reduce((acc, mod) => acc + mod.value, 0);

    if (this.damageData.ed.dice)
    {
      result.edDice = (await new Roll(`${this.damageData.ed.dice}d6`).roll()).total;
      result.ed += edDice;
    }

    if (this.damageData.ap.dice)
      {
        result.apDice = (await new Roll(`${this.damageData.ap.dice}d6`).roll()).total;
        result.ap += apDice;
      }

    this.roll = Roll.fromTerms([
      new PoolDie({ number: result.ed || 0, faces: 6, options: { values: this.damageData.damageDice.values, add : this.damageData.damageDice.addValue } }),
    ])

    await this.roll.evaluate();

    this.damageData.roll = this.roll.toJSON();
    this.damageData.dice = this.roll.dice.reduce((prev, current) => prev.concat(current.results), []);

    // Set dice indices before filtering out shifted
    this.damageData.dice.forEach((die, index) => die.index = index);

    result.other.mortal = (await new Roll(this.damageData.other.mortal || "0").roll()).total
    result.other.wounds = (await new Roll(this.damageData.other.wounds || "0").roll()).total
    result.other.shock = (await new Roll(this.damageData.other.shock || "0").roll()).total


    this.data.result = result;
    await Promise.all(this.actor.runScripts("computeDamage", {damage : this.data.result, roll : this, test : this.source?.system.test, modifiers}) || []);
    await Promise.all(this.item?.runScripts("computeDamage", {damage : this.data.result, roll : this, test : this.source?.system.test, modifiers}) || []);
    this.result.base += modifiers.damage.reduce((acc, mod) => acc + mod.value, 0);
    this.result.ap += modifiers.ap.reduce((acc, mod) => acc + mod.value, 0);
    this.result.other.mortal += modifiers.mortal.reduce((acc, mod) => acc + mod.value, 0);
    this.result.other.shock += modifiers.shock.reduce((acc, mod) => acc + mod.value, 0);

    this.computeDamage();

    let getModifierBreakdown = (modifiers) => {
      // modifiers[type].map(mod => `<li><p><strong>${mod.label}</strong>: ${HandlebarsHelpers.numberFormat(mod.value, { hash: { sign: true } })}</p></li>`);
      return modifiers.map(mod => `${mod.value >= 0 ? (" + "  + mod.value) : (" - " + Math.abs(mod.value))}  (${mod.label})`)

      // Should return " + X (label) - Y (label) or similar"
      // return modifiers[0]?.value >= 0 ? ` + ${str}` : str
  }

    this.result.breakdown = {
      damage : `<p>${this.damageData.damage} (Base) + ${result.rolledValue} (ED) ${getModifierBreakdown(modifiers.damage)}</p>`,
      mortal : `<p>${this.damageData.other.mortal} (@DICE) ${getModifierBreakdown(modifiers.mortal)}`,
      wounds : `<p>${this.damageData.other.wounds} (@DICE) ${getModifierBreakdown(modifiers.wounds)}`,
      shock : `<p>${this.damageData.other.shock} (@DICE) ${getModifierBreakdown(modifiers.shock)}`,
    }

    
    if (this.damageData.other.mortal.includes("d")) 
    { this.result.breakdown.mortal = this.result.breakdown.mortal.replace("@DICE", result.other.mortal)}
    else 
    {this.result.breakdown.mortal = this.result.breakdown.mortal.replace("(@DICE)", "")}
    
    if (this.damageData.other.wounds.includes("d")) 
    { this.result.breakdown.wounds = this.result.breakdown.wounds.replace("@DICE", result.other.wounds)}
    else 
    {this.result.breakdown.wounds = this.result.breakdown.wounds.replace("(@DICE)", "")}
    
    if (this.damageData.other.shock.includes("d")) 
    { this.result.breakdown.shock = this.result.breakdown.shock.replace("@DICE", result.other.shock)}
    else 
    {this.result.breakdown.shock = this.result.breakdown.shock.replace("(@DICE)", "")}

    
    if (this.result.ap)
    {
      this.result.breakdown.ap = `<p>${this.damageData.ap.value} (Base) ${getModifierBreakdown(modifiers.ap)}</p>`
    }

    if (this.result.ed)
    {
      this.result.breakdown.ed = `<p><strong>ED</strong>: ${this.damageData.ed.value} (Base) ${getModifierBreakdown(modifiers.ed)}</p>`;
    }
    await this.sendToChat();
  }

  computeDamage()
  {   
    
    this.result.roll = foundry.utils.deepClone(this.damageData.roll);
    this.result.dice = foundry.utils.deepClone(this.damageData.dice);

    if (this.rerollData.indices?.length) {
      this._computeReroll();
    }
    this.result.total = this.result.base;
    this.result.rolledValue = 0;
    this.result.dice.forEach((die) => {
          this.result.rolledValue += die.value;
          this.result.total += die.value;
    });



  }


  _computeReroll() {
    let rerolledResults = [];
    for (let reroll of this.rerolledDamage)
      rerolledResults.push(reroll.dice.reduce((prev, current) => prev.concat(current.results.map(i => {
        i.rerolled = true;
        return i;
      })), []))

    // Merge rerolls and roll - For each reroll set, take the corresponding reroll indices and keep the dice that the indices indicate
    for (let i = 0; i < rerolledResults.length; i++) {
      let rerollResult = rerolledResults[i];
      let shouldRerollSet = this.rerollData.indices[i];
      this.result.dice = this.result.dice.reduce((prev, current, i) => {
        if (shouldRerollSet.includes(i)) {
          prev.push(rerollResult[i]);
        } else {
          prev.push(current);
        }
        return prev;
      }, [])
    }
  }

  async reroll(diceIndices) {

    this.rerollData.indices.push(diceIndices)

    let reroll = await this.roll.reroll({async: true});
    this.rerollData.rerolls.push(reroll.toJSON())
    this.rerolledDamage.push(reroll)

    this.computeDamage();

    if (game.dice3d) {
      let rerollShow = reroll.toJSON();
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


  clearRerolls() {
    this.rerollData.indices = []
    this.rerollData.rerolls = [];
    this.computeDamage();
    this.sendToChat()
  }


  async sendToChat({ newMessage = null} = {}) {
    const html = await renderTemplate(this.template, this);
    let chatData = {
      _id : randomID(),
      type: "damage",
      rolls: [this.roll],
      system: this.data,
      user: game.user.id,
      rollMode: game.settings.get("core", "rollMode"),
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

  addReport(reports, replace=false)
  {
    let newReports = reports.map(r => `<p class="report" data-uuid="${r.uuid}" data-tooltip="${r.breakdown}" data-tooltip-direction="LEFT">${r.resisted ? '<i class="fa-solid fa-shield"></i>' : '<i class="fa-solid fa-user-minus"></i>'} ${r.message}</p>`).join("")

    this.context.appliedReport = replace ? newReports : ((this.context.appliedReport || "") + newReports)
    this.sendToChat()
  }

  async applyToTargets()
  {
    let tokens = (game.user.targets.size ? Array.from(game.user.targets).map(t => t.document) : this.targetTokens);
    let reports = await Promise.all(tokens.map(t => t.actor?.applyDamage(this.result.total + this.result.other.wounds, {ap : this.result.ap, shock : this.result.other.shock, mortal : this.result.other.mortal}, {test : this.source?.system.test, damageRoll: this, token : t})));
    this.addReport(reports);
  }

  get hasRerolled()
  {
    return this.rerollData.indices.length
  }


  get damageData()
  {
    return this.data.damageData;
  }

  get rerollData()
  {
    return this.data.rerollData;
  }


  get context()
  {
    return this.data.context;
  }

  get result()
  {
    return this.data.result;
  }

  get message()
  {
    return game.messages.get(this.context.messageId)
  }

  get source()
  {
    return game.messages.get(this.context.source)
  }

  get targetTokens() 
  {
    // Ability rolls aren't sourced from a Test, they roll damage directly
    return this.source ? this.source.system.test.targetTokens : this.context.targets.map(i => game.scenes.get(i.scene)?.tokens.get(i.token));
  }

  get actor() { return game.wng.utility.getSpeaker(this.context.speaker) }

  get item()
  {
    return this.source?.system.test?.item || fromUuidSync(this.context.itemId);
  }
}
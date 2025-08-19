import { PoolDie, WrathDie } from "./test";

export class BasicRoll {

  constructor(terms) {
      this.terms = terms;
      this.dice = terms.reduce((dice, term) => dice.concat(term.results), []);
      this.icons = this.dice.reduce((prev, current) => prev + current.value, 0)

  }

  static async roll(dice=1, wrath=1, chatData={})
  {
    let pool = dice - wrath;
    let formula = `${pool}dp + ${wrath}dw`;
    let roll = await new Roll(formula).roll();
    roll.toMessage(chatData);
    return this.fromRoll([roll]);
  }

  static fromRoll(rolls)
  {
    let terms = [];
    rolls.forEach(r => {
      terms = terms.concat(r.terms.filter(t => t instanceof PoolDie || t instanceof WrathDie))
  })
    return new this(terms);
  }


  async getMessageContent()
  {
    let html = await renderTemplate("systems/wrath-and-glory/templates/chat/roll/basic-roll.hbs", {dice : this.dice, icons : this.icons})
    return html;
  }

}

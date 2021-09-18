import { WNGTest } from "./test.js"

export default class PowerTest extends WNGTest {
  constructor(data = {})
  {
    super(data)
    if (!data)
      return

    this.data.testData.ed = data.ed
    this.data.testData.ap = data.ap
    this.data.testData.damage= data.damage

    this.testData.itemId = data.itemId
  }


  async rollTest()
  {
    await super.rollTest()
    if (this.result.isSuccess)
      this.rollDamage() 
  }

  async sendToChat()
  {
    await super.sendToChat()
    if (this.result.damage)
      this._sendDamageToChat()
  }

  async rollDamage() {
    let ed = this.testData.ed.base + this.testData.ed.bonus + this.getRankNum(this.testData.ed.rank);
    let formula = `${ed}d6`;
    let r = new Roll(formula, {});
    r.evaluate({async: true});
    this.result.damage = {
      total: this.testData.damage.base + this.testData.damage.bonus + this.getRankNum(this.testData.damage.rank),
      dice : []
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
  

  // static recreate(data) {
  //   let test = new game.wng.rollClasses[data.context.rollClass]()
  //   test.data = data;
  //   test.roll = Roll.fromJSON(test.result.roll)
  // }

  // async rollTest() {
  //   this.result.wrathSize = this.testData.wrath.base > 0 ? this.testData.wrath.base : 1;
  //   this.result.poolSize = this.testData.pool.size + this.testData.pool.bonus - 1;
  //   this.result.dn = this.testData.difficulty.target + this.testData.difficulty.penalty;
  //   await this._rollDice()
  //   this._computeResult();
  // }
  

  // _computeResult() {
  //   this.result.roll = this.roll.toJSON()
  //   this.result.dice = this.result.roll.terms.reduce((prev, current) => prev = prev.concat((current.results || []).filter(i => i.active)), [])
  //   this.result.success = this.result.dice.reduce((prev, current) => prev + current.value, 0)
  //   this.result.failure = this.result.dice.reduce((prev, current) => prev + (current.value === 0 ? 1 : 0), 0)
  //   this.result.shifting = this._countShifting();
  //   this.result.isSuccess = this.result.success >= this.testData.dn;
  //   this.result.isWrathCritical = this.result.dice.some(r => r.isWrath && r.result.value == 6)
  //   this.result.isWrathComplication = this.result.dice.some(r => r.isWrath && r.result.value == 1)
  // }


  get power() {return this.actor.items.get(this.testData.itemId)}
  
}


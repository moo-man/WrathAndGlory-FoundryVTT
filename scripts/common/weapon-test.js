import { WNGTest } from "./test.js"

export default class WeaponTest extends WNGTest {
  constructor(data)
  {
    super(data)
    if (!data)
      return

    this.testData.itemId = data.itemId
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


  get weapon() {return this.actor.items.get(this.testData.itemId)}
  
}


import { PoolDie, WNGTest } from "./test.js";

export default class DeterminationRoll extends WNGTest {
  constructor(data = {}) {
    super(data)
    if (data)
      this.testData.wounds = data.wounds

  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/determination/determination-roll.html"
  }
  
  async rollTest() {
    this.result.poolSize = this.testData.pool.size + this.testData.pool.bonus + this.getRankNum(this.testData.pool.rank);
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
    ])

    await this.roll.evaluate({ async: true });
  }

  _computeResult() {
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
    this.result.allDice = duplicate(this.result.dice)
    this.result.success = this.result.dice.reduce((prev, current) => prev + current.value, 0)
    this.result.failure = this.result.dice.reduce((prev, current) => prev + (current.value === 0 ? 1 : 0), 0)
    this.result.shiftsPossible = 0
    this.result.shock = this.result.success >= this.result.wounds ? this.result.wounds : Math.min(this.result.success, this.testData.wounds)
    this.result.wounds = this.testData.wounds >= this.result.success ? this.testData.wounds - this.result.success : 0

    //this.result.isSuccess = this.result.success >= this.result.dn;
  }

  get isShiftable() { return false }

  get determination() { return true}

}

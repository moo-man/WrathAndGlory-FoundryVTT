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
    super._computeResult(false,false);
    this.result.shock = this.result.success >= this.result.wounds ? this.result.wounds : Math.min(this.result.success, this.testData.wounds)
    this.result.wounds = this.testData.wounds >= this.result.success ? this.testData.wounds - this.result.success : 0
  }

  get isShiftable() { return false }

  get determination() { return true}

}

import { PoolDie, WNGTest } from "./test.js";

export default class InitiativeRoll extends WNGTest {
  constructor(data = {}) {
    super(data)
    this.testData.useDN = false

  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/initiative/initiative-roll.hbs"
  }

  async rollTest() {
    this.result.poolSize = this.testData.pool.size + this.testData.pool.bonus + this.getRankNum(this.testData.pool.rank);
    await this._rollDice()
    this._computeResult();
  }

  async _rollDice() {

    this.roll = Roll.fromTerms([
      new PoolDie({ number: this.result.poolSize, faces: 6 }),
    ])

    await this.roll.evaluate({ async: true });
  }

  _computeResult() {
    super._computeResult();
    this.result.initiative = this.result.success
  }

  get isShiftable() { return false }

  get initiative() { return true}

}

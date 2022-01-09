import { PoolDie, WNGTest } from "./test.js";

export default class StealthRoll extends WNGTest {
  constructor(data = {}) {
    super(data)
    this.testData.useDN = false
  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/stealth/stealth-roll.html"
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
    this.result.stealth = this.result.success;
    this._setStealthScore(this.result.success);
  }

  async _setStealthScore(stealthScore) {
    await this.actor.update({"data.combat.stealth" : stealthScore})
  }

  get isShiftable() { return false }

  get stealth() {return true}
}

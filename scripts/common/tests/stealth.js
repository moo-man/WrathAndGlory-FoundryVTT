import { PoolDie, WNGTest } from "./test.js";

export default class StealthRoll extends WNGTest {
  constructor(data = {}) {
    super(data)
  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/stealth/stealth-roll.html"
  }

  async rollTest() {
    this.result.poolSize = this.testData.pool.size + this.testData.pool.bonus + this.getRankNum(this.testData.pool.rank);
    await this._rollDice()
    this._computeResult();

    if(this.result.isWrathCritical && !this.context.counterChanged)
    {
      this.context.counterChanged = true
      if (this.actor.type === "agent")
        game.wng.RuinGloryCounter.changeCounter(1,  "glory").then(() => {game.counter.render(true)})
      else if (this.actor.type === "threat")
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
    this.result.stealth = this.result.success;
    this._setStealthScore(this.result.success);
  }

  async _setStealthScore(stealthScore) {
    await this.actor.update({"data.combat.stealth" : stealthScore})
  }

  get isShiftable() { return false }
}

import { PoolDie, WNGTest } from "./test.js";

export default class StealthRoll extends WNGTest {
  constructor(data = {}) {
    super(data)
    if (foundry.utils.isEmpty(data))  
      return
    this.testData.useDN = false
  }

  get template() {
    return "systems/wrath-and-glory/templates/chat/roll/stealth/stealth-roll.hbs"
  }

  _computeResult() {
    super._computeResult();
    this.result.stealth = this.result.success;
    this._setStealthScore(this.result.success);
  }

  async _setStealthScore(stealthScore) {
    await this.actor.update({"system.combat.stealth" : stealthScore})
  }

  get isShiftable() { return false }

  get stealth() {return true}
}

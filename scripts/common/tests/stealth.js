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
  }

  async runPostScripts()
  {
      await super.runPostScripts();
      await this.actor.update({"system.combat.stealth" : this.result.stealth})
  }

  get isShiftable() { return false }

  get stealth() {return true}
}

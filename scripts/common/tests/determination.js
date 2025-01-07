import { PoolDie, WNGTest } from "./test.js";

export default class DeterminationRoll extends WNGTest {
  constructor(data = {}) {
    super(data)
    if (foundry.utils.isEmpty(data))  
      return
    
    
    this.testData.wounds = data.wounds;
    this.testData.ignoreShock = data.ignoreShock;
    this.testData.useDN = false

  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/determination/determination-roll.hbs"
  }
  _computeResult() {
    super._computeResult();
    // Convert number of successes to shock (but no more than the original wounds value)
    this.result.converted = this.result.success >= this.result.wounds ? this.result.wounds : Math.min(this.result.success, this.testData.wounds)
    this.result.shock = this.testData.ignoreShock ? 0 : this.result.converted;
    this.result.shockIgnored = this.testData.ignoreShock;
    // Reduce Wounds by successes rolled
    this.result.wounds = this.testData.wounds >= this.result.success ? this.testData.wounds - this.result.success : 0
  }

  get isShiftable() { return false }

  get determination() { return true}

}

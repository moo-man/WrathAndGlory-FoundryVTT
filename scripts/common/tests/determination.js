import { PoolDie, WNGTest } from "./test.js";

export default class DeterminationRoll extends WNGTest {
  constructor(data = {}) {
    super(data)
    if (data)
    {
      this.testData.wounds = data.wounds
    }
    this.testData.useDN = false

  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/determination/determination-roll.hbs"
  }
  _computeResult() {
    super._computeResult();
    this.result.shock = this.result.success >= this.result.wounds ? this.result.wounds : Math.min(this.result.success, this.testData.wounds)
    this.result.wounds = this.testData.wounds >= this.result.success ? this.testData.wounds - this.result.success : 0
  }

  get isShiftable() { return false }

  get determination() { return true}

}

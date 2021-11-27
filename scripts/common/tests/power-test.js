import { WNGTest } from "./test.js"

export default class PowerTest extends WNGTest {
  constructor(data = {})
  {
    super(data)
    if (!data)
      return

    this.data.testData.ed = data.ed || {}
    this.data.testData.ap = data.ap || {}
    this.data.testData.damage= data.damage || {}

    this.testData.itemId = data.itemId
  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/power/power-roll.html"
  }



  _computeResult()
  {
    super._computeResult()
    if (this.result.isSuccess)
      this.rollDamage() 
  }
  
  get power() {return this.actor.items.get(this.testData.itemId)}
  
}


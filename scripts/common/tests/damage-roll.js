import { WNGTest } from "./test.js"

// Used for items that don't roll tests, just roll damage or cause effects
export default class AbilityRoll extends WNGTest {
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
    return "systems/wrath-and-glory/template/chat/roll/damage/damage-roll.html"
  }


  async rollTest() {
    this._computeResult();
  }

  _computeResult()
  {
    this.rollDamage() 
  }
  
  sendToChat() {
    this.sendDamageToChat()
  }

  get testEffects() {
    if(this.item)
      return this.item.effects.filter(e => !e.data.transfer)
    else 
      return []
  }

  get showEffects() {
    return this.testEffects.length
  }

  get showTest() {
    return this.item && this.item.hasTest 
  }


  get ability() {return true}


  
}

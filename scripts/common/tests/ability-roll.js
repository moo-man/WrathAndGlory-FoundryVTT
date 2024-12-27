import { WNGTest } from "./test.js"

// Used for items that don't roll tests, just roll damage or cause effects
export default class AbilityRoll extends WNGTest {
  constructor(data = {})
  {
    data.targets = Array.from(game.user.targets).map(t => t.actor?.speakerData(t.document));
    super(data)
    if (!data)
      return

    this.data.testData.ed = data.ed;
    this.data.testData.ap = data.ap;
    this.data.testData.damage= data.damage
    this.data.testData.damageDice= data.damageDice

    this.data.testData.otherDamage = data.otherDamage || {}

    this.testData.itemId = data.itemId
    this.data.context.title = data.title;
  }

  async rollTest() {
    this._computeResult();
  }

  _computeResult()
  {
    this.data.result = {}
    if (this.item.hasTest) this.result.test = duplicate(this.item.test);
    this.computeDamage()
  }
  
  sendToChat() {
    this.rollDamage() 
  }

  get showTest() {
    return this.item && this.item.hasTest 
  }


  get ability() {return true}


  
}

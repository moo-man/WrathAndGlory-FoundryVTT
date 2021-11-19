import { WNGTest } from "./test.js"

export default class WeaponTest extends WNGTest {
  constructor(data = {})
  {
    super(data)
    if (!data)
      return

    this.data.testData.ed = data.ed
    this.data.testData.ap = data.ap
    this.data.testData.damage= data.damage

    this.testData.itemId = data.itemId
  }


  _computeResult()
  {
    super._computeResult()
    if (this.result.isSuccess)
      this.rollDamage() 
  }

  get weapon() {return this.actor.items.get(this.testData.itemId)}
  
}


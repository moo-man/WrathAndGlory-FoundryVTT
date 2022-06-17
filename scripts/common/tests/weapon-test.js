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
    this.data.testData.range = data.range
    this.data.testData.aim = data.aim

    this.testData.itemId = data.itemId
  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/weapon/weapon-roll.html"
  }

  _computeResult()
  {
    super._computeResult()

    this.result.range = this.testData.range
    this.result.aim = this.testData.aim
    if (this.item.hasTest) this.result.test = duplicate(this.item.test);
    if (this.result.isSuccess)
      this.computeDamage() 
  }

  get weapon() {return this.actor.items.get(this.testData.itemId)}
  
}


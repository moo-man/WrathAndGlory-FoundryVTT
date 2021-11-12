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


  async rollTest()
  {
    await super.rollTest()
    if (this.result.isSuccess)
      this.rollDamage() 
  }

  async sendToChat()
  {
    await super.sendToChat()
    if (this.result.damage)
      this._sendDamageToChat()
  }

  // async rollDamage() {
  //   let ed = this.testData.ed.base + this.testData.ed.bonus + this.getRankNum(this.testData.ed.rank);
  //   let formula = `${ed}d6`;
  //   let r = new Roll(formula, {});
  //   r.evaluate({async: true});
  //   this.result.damage = {
  //     total: this.testData.damage.base + this.testData.damage.bonus + this.getRankNum(this.testData.damage.rank),
  //     dice : []
  //   };
  //   r.terms.forEach((term) => {
  //     if (typeof term === 'object' && term !== null) {
  //       term.results.forEach(result => {
  //         let die = this._computeExtraDice(result.result, this.testData.ed.die);
  //         this.result.damage.total += die.value;
  //         this.result.damage.dice.push(die);
  //       });
  //     }
  //   });
  //   this.damageRoll = r;
  //   this.result.damage.roll = r.toJSON()
  // }


  get power() {return this.actor.items.get(this.testData.itemId)}
  
}


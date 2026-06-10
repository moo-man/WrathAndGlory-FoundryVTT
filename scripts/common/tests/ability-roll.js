import { WNGTest } from "./test.js"

export default class AbilityRoll extends WNGTest {
  constructor(data = {})
  {
    super(data)
    if (foundry.utils.isEmpty(data))
      return

    this.addDamageData(data);
  }

  get template() {
    return "systems/wrath-and-glory/templates/chat/roll/ability/ability-roll.hbs"
  }


  async edit({pool=0, wrath=0, icons=0, damage=0, ed=0, ap=0}={})
  {
    this.data.testData.edit.damage += damage;
    this.data.testData.edit.ed += ed;
    this.data.testData.edit.ap += ap;
    await super.edit({pool, wrath, icons})
  }

  _computeResult()
  {
    super._computeResult()

    if (this.result.isWrathCritical)
      this.result.isWrathCritical = this.result.isWrathCritical && this.result.isSuccess // Only critical if test is successful

    if (this.ability.system.traits?.has("blast"))
    {
      this.result.blast = this.ability.system.traits.has("blast").rating;
      if (!this.result.isSuccess)
      {
        this.result.scatter = true;
        this.computeDamage();
      }
    }
  }

  get ability() {return fromUuidSync(this.testData.itemId)}
  
}


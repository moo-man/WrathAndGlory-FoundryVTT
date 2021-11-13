import { WNGTest } from "./test.js"

export default class ResolveTest  extends WNGTest {
  constructor(data = {})
  {
    super(data)
    if (!data)  
      return

      this.testData.type = data.type
  }


  async rollTest()
  {
    await super.rollTest()
    if (!this.result.isSuccess && !this.context.effectApplied)
    {
      this.context.effectApplied = true;

      if (this.terror)
        this.actor.addCondition("terror")
      if (this.fear)
        this.actor.addCondition("fear")

    }
  }

  async reroll() {
    await super.reroll() 

    if (this.result.isSuccess && this.context.effectApplied)
    {
      this.context.effectApplied = false;

      if (this.terror)
        this.actor.removeCondition("terror")
      if (this.fear)
        this.actor.removeCondition("fear")
      this.updateMessageFlags();
    }
  }

  get terror() {
    return this.testData.type == "terror";
  }

  get fear() {
    return this.testData.type == "fear"
  }

} 


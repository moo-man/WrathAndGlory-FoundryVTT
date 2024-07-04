import { WNGTest } from "./test.js"

export default class MutationTest  extends WNGTest {
  constructor(data = {})
  {
    super(data)
  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/mutation/mutation-roll.hbs"
  }



  async rollTest()
  {
    await super.rollTest()
    if (!this.result.isSuccess)
      this.result.mutation = true;
  }

  get mutation() {
    return true;
  }



} 


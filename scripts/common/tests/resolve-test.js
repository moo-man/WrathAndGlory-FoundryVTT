import { WNGTest } from "./test.js"

export default class ResolveTest  extends WNGTest {
  constructor(data = {})
  {
    super(data)
    if (foundry.utils.isEmpty(data))  
      return

      this.context.fear = data.context.fear;
      this.context.terror = data.context.terror;
  }

  get template() {
    return "systems/wrath-and-glory/templates/chat/roll/resolve/resolve-roll.hbs"
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
    if (!this.result.isSuccess && !this.context.pointsAdded && this.actor.hasPlayerOwner)
    {
      this.context.pointsAdded = true;
      game.wng.RuinGloryCounter.changeCounter(1,  "ruin").then(() => {
        game.counter.render({force: true})
      })
    }

  }

  async reroll(...args) {
    await super.reroll(...args) 

    if (this.result.isSuccess && this.context.effectApplied)
    {
      this.context.effectApplied = false;

      if (this.terror)
        this.actor.removeCondition("terror")
      if (this.fear)
        this.actor.removeCondition("fear")
      this.updateMessageFlags();
    }
    if (this.result.isSuccess && this.context.pointsAdded && this.actor.hasPlayerOwner)
    {
      this.context.pointsAdded = true;
      game.wng.RuinGloryCounter.changeCounter(-1,  "ruin").then(() => {
        game.counter.render({force: true})
      })
    }
  }

  get terror() {
    return this.context.terror;
  }

  get fear() {
    return this.context.fear;
  }


} 


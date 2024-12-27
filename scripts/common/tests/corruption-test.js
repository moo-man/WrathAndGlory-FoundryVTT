import { WNGTest } from "./test.js"

export default class CorruptionTest  extends WNGTest {
  constructor(data = {})
  {
    super(data)
  }

  get template() {
    return "systems/wrath-and-glory/template/chat/roll/corruption/corruption-roll.hbs"
  }


  async rollTest()
  {
    await super.rollTest()
    if (this.result.isWrathCritical && !this.context.dnReducedCritical)
    {
      this.context.dnReducedCritical = true;
      this.testData.difficulty.penalty -= 2
      this._computeResult()
    }

    if (!this.result.isSuccess && !this.context.pointsAdded) {
      this.context.pointsAdded = true;
      game.wng.RuinGloryCounter.changeCounter(1, "ruin").then(() => {
        game.counter.render(true)
      })

      let corruption = this.result.dn - this.result.success;

      if (this.result.isWrathComplication) {
        corruption *= 2
        this.result.doubleCorruption = true;
      }

      this.result.failure += " - " + game.i18n.format(`CHAT.FAIL_CORRUPTION`, {corruption})
      this.context.corruptionAdded = corruption;

      let prevLevel = this.actor.corruptionLevel;

      await this.actor.update({"system.corruption.current": this.actor.corruption.current + corruption})

      let newLevel = this.actor.corruptionLevel;

      if (prevLevel < newLevel) {
        ui.notifications.notify(game.i18n.localize("ROLL.NewCorruptionLevel"))
        this.actor.setupGenericTest("mutation").then(test => {
          test.rollTest();
        })
      }
    }
  }

  async reroll(...args) {
    await super.reroll(...args)
    if (this.result.isSuccess && this.context.pointsAdded)
    {
      this.revertPoints()
      this.context.pointsAdded = false
      this.updateMessageFlags();
    }
  }

  revertPoints()
  {
    this.actor.update({"system.corruption.current" : this.actor.corruption.current - this.context.corruptionAdded})
    ui.notifications.notify(game.i18n.localize("ROLL.CORRUPTION_REVERTED"))
    game.wng.RuinGloryCounter.changeCounter(-1,  "ruin").then(() => {
      game.counter.render(true)
      ui.notifications.notify(game.i18n.format("COUNTER.RUIN_CHANGED", {change : -1}))
    })

    Object.values(ui.windows).filter(app => app.data?.title == "Mutation").forEach(app => app.close())

  }

  get corruption() {
    return true;
  }



}


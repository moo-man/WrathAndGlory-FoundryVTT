let test = await this.actor.setupSkillTest("psychicMastery", {appendTitle: ` - ${this.effect.name}`, skipTargets: true});
//let opposed = this.effect.getFlag("wrath-and-glory", "opposed")

if (test.result.success >= this.effect.sourceTest.result.success)
{
  return;
}
let dice = await new Roll("1d3").roll();
dice.toMessage(this.script.getChatData());

let mortal = dice.total + (this.effect.sourceTest.result.mortal || 0);

let report = await this.actor.applyDamage(0, {mortal});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}"> Received ${report.wounds} Wounds and ${report.shock} Shock</span>`)
let test = await this.actor.setupAttributeTest("willpower", {appendTitle: ` - ${this.effect.name}`, skipTargets: true});
let opposed = this.effect.getFlag("wrath-and-glory", "opposed")

let diff = opposed - test.result.success;

let report;
if (this.effect.sourceTest.result.mortal)
{
  report = await this.actor.applyDamage(0, {mortal: opposed})
}
else
{
  report = await this.actor.applyDamage(opposed, {ignoreArmour: true})
}

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}"> Received ${report.wounds} Wounds and ${report.shock} Shock</span>`)
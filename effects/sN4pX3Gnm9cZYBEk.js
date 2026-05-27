let test = await this.actor.setupSkillTest("psychicMastery", {fields: {difficulty: 5}, appendTitle: " - " + this.effect.name, skipTargets: true})

if (!test.result.isSuccess)
{
  let mortal = Math.ceil(CONFIG.Dice.randomUniform() * 3);
  let report = await this.actor.applyDamage(0, {mortal});
  this.script.message(`Received ${report.wounds} Mortal Wounds`);
}

if (this.effect.sourceTest.result.fear)
{
  this.actor.setupGenericTest("fear", {fields : {difficulty : 3}, appendTitle: ` - ${this.effect.name}`})
}
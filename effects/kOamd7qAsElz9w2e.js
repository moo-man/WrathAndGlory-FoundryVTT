let report = await this.actor.applyDamage(0, {shock : (this.effect.sourceActor.system.advances.rank)});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}">Received ${report.shock} Shock</span>`);

let test = await this.actor.setupAttributeTest("toughness", {fields : {difficulty : 3}, appendTitle: ` - ${this.effect.name}`});

if (!test.result.isSuccess)
{
	await this.actor.addCondition("restrained");
}
if (test.result.isWrathComplication)
{
  await this.actor.addCondition("prone");
}
let test = await this.actor.setupAttributeTest("agility", {fields : {difficulty : 5}, appendTitle: ` - ${this.effect.name}`});

if (test.result.isSuccess)
{
	await this.actor.addCondition("staggered");
}
else
{
  await this.actor.addCondition("prone");
}
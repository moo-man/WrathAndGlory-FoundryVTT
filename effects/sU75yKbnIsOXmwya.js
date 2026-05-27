let difficulty = this.effect.sourceTest.result.increaseDN ? 5 : 4;

let test = await this.actor.setupGenericTest("fear", {fields: {difficulty}});

if (!test.result.isSuccess)
{
  this.actor.addCondition("blinded");
  if (this.effect.sourceTest.result.increaseDN) 
  {
    this.actor.addCondition("prone");
  }
}
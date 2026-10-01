await this.actor.addCondition("hindered");

if (this.effect.sourceTest.result.staggered)
{
  let test = await this.actor.setupAttributeTest("toughness", {fields : {difficulty : 5}});
  if (!test.result.isSuccess)
  {
    this.actor.addCondition("staggered");
  }

}
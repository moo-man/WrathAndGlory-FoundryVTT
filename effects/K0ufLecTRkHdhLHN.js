let test = await this.actor.setupTestFromItem(this.effect.sourceItem);

if (test.result.isSuccess)
{
let report = await this.actor.applyDamage(0, {shock : 1});
this.script.message(`Received ${report.shock} Shock`)
}
else 
{
  let shock = Math.ceil(CONFIG.Dice.randomUniform() * 3)
  let report = await this.actor.applyDamage(0, {shock});
  this.script.message(`Received ${report.shock} Shock`)
  this.actor.addCondition("staggered");
}
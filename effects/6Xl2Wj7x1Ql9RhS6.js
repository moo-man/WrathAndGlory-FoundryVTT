let test = await this.actor.setupAttributeTest("toughness", {appendTitle: this.effect.name, fields : {difficulty : this.effect.sourceTest.result.test.dn}});

if (!test.result.isSuccess)
{
  let permEffect = this.effect.sourceItem.effects.get("7pLXVZ6hzTEMTzUe").convertToApplied();
  delete permEffect.statuses;
  permEffect.system.transferData.type == "document";
  ActiveEffect.create(permEffect, {parent: this.actor});
}
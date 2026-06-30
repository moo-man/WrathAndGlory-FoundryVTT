this.actor.addCondition("hindered");

if (this.effect.getFlag(game.system.id, "favoured"))
{
  this.actor.setupGenericTest("corruption", {fields: {difficulty: 5}});
}
if (this.actor.hasCondition("poisoned"))
{
  let roll = await new Roll("2dp").roll();
  roll.toMessage(this.script.getChatData());
  let damage = 2 + this.effect.sourceActor.system.attributes.strength.total + roll.total;
  this.actor.applyDamage(damage);
}
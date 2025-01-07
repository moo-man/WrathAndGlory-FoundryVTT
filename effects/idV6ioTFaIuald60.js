let roll = await new Roll("dp").roll();
roll.toMessage(this.script.getChatData());

if (roll.total == 6)
{
  await this.actor.applyHealing({wounds: 1, shock: 1}, {messageData : this.script.getChatData()});
  this.actor.removeCondition("dying");
  this.actor.removeCondition("exhausted");
  this.actor.removeCondition("prone");
  this.actor.removeCondition("dead");
}
let roll = Math.ceil(CONFIG.Dice.randomUniform() * 12);
if (this.actor.system.combat.shock.value != 0)
{
  this.actor.applyHealing({shock : roll}, {messageData : this.script.getChatData()})	
}
else if (this.actor.system.combat.wound != 0)
{
	this.actor.applyHealing({wounds : roll}, {messageData : this.script.getChatData()})
}
this.actor.applyHealing({shock}, {messageData : this.script.getChatData()});
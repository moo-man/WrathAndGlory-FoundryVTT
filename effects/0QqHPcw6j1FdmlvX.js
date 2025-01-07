if (this.actor.system.combat.wounds.value != 0)
{
	this.actor.applyHealing({wounds : this.effect.sourceTest.result.wounds}, {messageData : this.script.getChatData()})	
}
else if (this.actor.system.combat.shock.value != 0)
{
	this.actor.applyHealing({shock : this.effect.sourceTest.result.shock}, {messageData : this.script.getChatData()})
}
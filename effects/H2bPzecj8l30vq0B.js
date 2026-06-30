if (this.actor.system.combat.wounds.value != 0)
{
	this.actor.applyHealing({wounds : 1}, {messageData : this.script.getChatData()});	
}
else if (this.actor.system.combat.shock.value != 0)
{
	this.actor.applyHealing({shock : this.actor.corruptionLevel || 1}, {messageData : this.script.getChatData()});	
}
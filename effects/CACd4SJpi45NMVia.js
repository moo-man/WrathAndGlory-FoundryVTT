if (this.actor.system.combat.shock.value != 0)
{
	this.actor.applyHealing({shock : await this.script.roll("1d6 + 1")}, {messageData : this.script.getChatData()});
}
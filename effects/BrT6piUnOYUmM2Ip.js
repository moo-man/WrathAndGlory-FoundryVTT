let wounds = this.effect.getFlag(game.system.id, "wounds");

if (wounds)
{
	this.actor.applyHealing({wounds : wounds * 2}, {messageData : this.script.getChatData()})
}
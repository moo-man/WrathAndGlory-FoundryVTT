if (args.result.isWrathCritical && this.actor.hasCondition("dying"))
{
  	this.actor.applyHealing({wounds : 1}, {messageData : this.script.getChatData()});
    this.actor.update({"system.resources.wrath" : this.actor.system.resources.wrath + 1});
    this.script.message("Gained 1 Wrath Point");
}
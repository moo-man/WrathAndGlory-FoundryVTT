if (args.test?.result.heal)
{
  this.actor.applyHealing({wounds : args.mortal}, {messageData : this.script.getChatData()})	

}
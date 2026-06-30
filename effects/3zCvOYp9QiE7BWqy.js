let heal = args.wounds + args.mortal;
if (heal)
{ 
  this.actor.applyHealing({wounds : heal}, {messageData : this.script.getChatData()})
}
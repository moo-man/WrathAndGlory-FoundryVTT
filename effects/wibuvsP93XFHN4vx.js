if (this.actor.system.combat.wounds.value != 0)
{
  this.actor.applyHealing({wounds : 3}, {messageData : this.script.getChatData()})
    
}
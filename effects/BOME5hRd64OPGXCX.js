const shock = Math.ceil(CONFIG.Dice.randomUniform() * 3);
if ((await this.item.spend("system.quantity")))
{
    this.actor.applyHealing({shock}, {messageData : this.script.getChatData()})
}
else 
{
  this.script.notification("No more left!", "error")
}
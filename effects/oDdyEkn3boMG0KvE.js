let roll = await new Roll("1d6").roll();
roll.toMessage(this.script.getChatData());
if (roll.total >= 5)
{
  let heal = await new Roll("1d6").roll();
  this.actor.applyHealing({wounds: heal.total}, {messageData: this.script.getChatData()})
}
let roll = await new Roll("dp").roll();

if (roll.dice[0].results[0].value >= 1) 
{
  this.actor.addCondition("frenzied");
}

roll.toMessage(this.script.getChatData());
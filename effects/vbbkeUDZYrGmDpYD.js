if ((args.fear || args.terror) && !args.isSuccess)
{
  let roll = await new Roll("1dp").roll();
  roll.toMessage(this.script.getChatData());
  if (roll.total >= 4)
  {
    this.actor.addCondition("frenzied")
  }
}
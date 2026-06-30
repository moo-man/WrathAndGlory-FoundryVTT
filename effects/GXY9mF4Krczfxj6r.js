if (args.actor.hasKeyword("PSYKER") && args.test?.result.isWrathCritical)
{
  let roll = await new Roll("1d3").roll();
  roll.toMessage(this.script.getChatData());
  args.modifiers.mortal.push({value: roll.total, label: this.effect.name});

}
if (args.test?.result.isWrathCritical && args.test?.context.flags.terror)
{ 
  let roll = await new Roll("1d3").roll();
  roll.toMessage(this.script.getChatData());
  args.modifiers.shock.push({value: roll.total, label: this.effect.name});
  args.modifiers.mortal.push({value: 1, label: this.effect.name});
}
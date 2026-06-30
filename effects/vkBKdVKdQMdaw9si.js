if (args.test?.result.isWrathCritical && args.test?.weapon?.system.isMelee)
{ 
  let roll = await new Roll("1d3").roll();
  roll.toMessage(this.script.getChatData());
  args.modifiers.shock.push({value: roll.total, label: this.effect.name});
  args.modifiers.mortal.push({value: 2, label: this.effect.name});
}
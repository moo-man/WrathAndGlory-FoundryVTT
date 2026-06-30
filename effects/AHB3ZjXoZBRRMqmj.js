if (args.test?.power && args.wounds + args.mortal)
{
  let roll = await new Roll("1d6").roll();
  roll.toMessage(this.script.getChatData());
  if (roll.total >= 5)
  {
    if (args.mortal)
    { 
      args.modifiers.mortal.push({label : this.effect.name, value : -Math.ceil(args.mortal / 2)})
    }
    if (args.wounds)
    {
      args.modifiers.wounds.push({label : this.effect.name, value : -Math.ceil(args.wounds / 2)})
    }
  }
}
if (!this.effect.flags.used && (args.wounds + args.mortal) > 0)
{
  this.effect.flags.used = true; // Cleared with update combat trigger, probably good enough
  let roll = await BasicRoll.roll(0, 1, this.script.getChatData())
  if (roll.dice.some(d => d.name == "wrath-critical"))
  {
    this.actor.update({"system.resources.wrath" : this.actor.system.resources.wrath + 1})
    this.script.message("Gained +1 Wrath");
  }
  
}
if (args.stealth && args.context.flags.statueStill)
{
  args.result.text[this.effect.id] = {label : this.effect.name, description : "Added additional +Rank to Stealth Score"};
  args.result.stealth += this.actor.system.advances.rank;
}
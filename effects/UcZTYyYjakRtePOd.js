if (args.test.weapon?.system.isMelee)
{
  if (await this.script.dialog("Gain 1 Ruin to inflict Double Rank Shock?"))
  {
    args.modifiers.shock.push({label : this.effect.name, value : this.actor.system.advances.rank * 2})
    game.counter.change(1, "ruin");
    this.script.message("Gained 1 Ruin");
  }
}
if (this.effect.sourceActor?.uuid == this.actor.uuid)
{
  if (this.effect.flags.round + 1 < game.combat.round)
  {
    this.effect.delete();
  }
}
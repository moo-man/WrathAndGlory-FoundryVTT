if (this.actor.uuid != this.effect.sourceActor.uuid)
{
  this.actor.system.combat.resilience.bonus += this.effect.sourceActor.system.advances.rank;
}
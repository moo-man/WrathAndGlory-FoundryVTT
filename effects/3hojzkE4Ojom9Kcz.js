if (this.effect.sourceActor?.uuid == this.actor.uuid)
{
  this.effect.updateSource({"flags.round" : game.combat.round});
}
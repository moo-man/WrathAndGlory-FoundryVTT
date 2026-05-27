if (args.options.seize && args.combat.combatant.actor?.uuid == this.actor.uuid)
{
  if (await this.script.dialog(`Activate ${this.effect.name}?`));
  this.effect.update({disabled: false});
}
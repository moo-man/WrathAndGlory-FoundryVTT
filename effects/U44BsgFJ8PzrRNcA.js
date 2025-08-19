if (args.test.weapon && (args.test.weapon.system.isMelee || args.test.result.isWrathComplication))
{
  this.actor.setupAbilityRoll(this.item);
}
if (args.item.system.isRanged && args.item.system.isEquipped && args.item.hasKeyword("PROJECTILE"))
{
	args.item.system.salvo += this.actor.system.advances.rank;

}
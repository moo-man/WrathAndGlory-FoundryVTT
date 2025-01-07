// Bug: https://github.com/foundryvtt/foundryvtt/issues/7987
// Solution currently is to divide by 2
if (args.item.system.isRanged && args.item.system.isEquipped && args.item.hasKeyword("PROJECTILE"))
{
	args.item.system.salvo += this.actor.system.advances.rank / 2;

}
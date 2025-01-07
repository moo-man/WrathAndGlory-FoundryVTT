if (args.item.type == "weapon" && args.item.hasKeyword(["BOLT", "MELTA", "FIRE"]))
{
	// See https://github.com/foundryvtt/foundryvtt/issues/7987
	args.item.system.damage.bonus += this.actor.system.advances.rank / 2
}
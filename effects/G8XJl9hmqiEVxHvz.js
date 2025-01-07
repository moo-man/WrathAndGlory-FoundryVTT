if (args.item.type == "weapon" && args.item.hasKeyword(["POWER FIELD"]))
{
	// See https://github.com/foundryvtt/foundryvtt/issues/7987
	args.item.system.damage.ap.bonus -= this.actor.system.advances.rank / 2
}
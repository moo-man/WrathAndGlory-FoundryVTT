if (args.item.type == "weapon" && args.item.hasKeyword(["POWER FIELD"]))
{
	args.item.system.damage.ap.bonus -= this.actor.system.advances.rank
}
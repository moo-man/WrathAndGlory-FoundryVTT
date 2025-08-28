if (args.item.type == "weapon" && args.item.hasKeyword(["BOLT", "MELTA", "FIRE"]))
{
	args.item.system.damage.bonus += this.actor.system.advances.rank
}
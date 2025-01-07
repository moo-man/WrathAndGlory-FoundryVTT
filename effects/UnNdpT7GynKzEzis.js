// https://github.com/foundryvtt/foundryvtt/issues/7987
if (args.item.type == "weapon" && args.item.system.isEquipped && args.item.traitList.sniper)
{
	let sniper = args.item.system.traits.list.find(i => i.name == "sniper");
	sniper.rating = Number(sniper.rating) + this.actor.system.advances?.rank/2 || 0
}
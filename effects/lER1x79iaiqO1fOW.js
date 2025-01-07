if (args.item.system.isEquipped && args.item.type == "weapon" && args.item.hasKeyword("BOLT"))
{
let sourceRF = args.item._source.system.traits.list.find(i => i.name == "rapidFire")
let rf = args.item.system.traits.list.find(i => i.name == "rapidFire");
if (sourceRF && !rf.bd)
{ 
    let rf = args.item.system.traits.list.find(i => i.name == "rapidFire");
    rf.rating = parseInt(args.item.traitList.rapidFire.rating) +  this.actor.system.advances.rank;
    rf.bd = true;
}
else if (!sourceRF && !rf)
{
    args.item.system.traits.list.push({name : "rapidFire", rating: 2})
}
}
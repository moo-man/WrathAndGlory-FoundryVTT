if (args.item.system.isEquipped && args.item.system.isRanged)
{
  if (!args.item.traitList.heavy)
  { 
      args.item.system.traits.list.push({name : "assault"});
  }
}
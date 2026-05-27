if (args.item.type == "weapon" && args.item.system.isRanged && !args.item.system.traits.list.find(i => i.name == "heavy"))
{
  args.item.system.traits.list.push({name: "pistol"})
}
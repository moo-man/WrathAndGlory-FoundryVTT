if (!args.item.isRanged)
  return;

if (!args.item._source.system.traits.list.find(i => i.name == "pistol"))
{
  args.item.system.traits.list.push({name : "pistol"});
}
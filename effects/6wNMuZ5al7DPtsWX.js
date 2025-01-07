let name = args.item._source.name;
if (name !== "Scything Talon" && name !== "Lash Whip")
{
  return;
}

if (!args.item._source.system.traits.list.find(i => i.name == "inflict"))
{
  args.item.system.traits.list.push({name : "inflict", rating:"Poisoned(4)"});
}
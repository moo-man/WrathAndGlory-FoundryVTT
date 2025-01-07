if (this.effect.sourceTest.result.brutal && args.item.system.isEquipped)
{
  if (!args.item._source.system.traits.list.find(i => i.name == "brutal"))
  {
    args.item.system.traits.list.push({name : "brutal"});
  }
}
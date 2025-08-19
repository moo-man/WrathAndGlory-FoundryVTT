if (
  this.effect.getFlag(game.system.id, "active") && 
  args.item.type == "weapon" && 
  args.item.system.isRanged)
{
  args.item.system.range.long *= 3
  if (args.item.system.traits.has("sniper"))
  {
    args.item.system.range.long = 1000
  }
}
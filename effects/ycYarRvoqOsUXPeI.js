if (this.actor.effects.find(i => i.statuses.has("halfCover") || i.statuses.has("fullCover")))
{
  if (args.item.type == "weapon" && args.item.name.toLowerCase().includes("shuriken"))
  {
    let rending = args.item.system.traits.list.find(i => i.name == "rending");
    if (rending)
    {
      rending.rating = Number(rending.rating) + this.actor.system.advances.rank;
    }
  }
}
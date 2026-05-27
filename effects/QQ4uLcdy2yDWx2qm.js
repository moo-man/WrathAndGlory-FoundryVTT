if (args.item.type == "weapon" && (args.item.system.isMelee))
{
  if (Number(args.item.system.damage.AP) > 0)
  {
    args.item.system.damage.ap.bonus += this.actor.system.advances.rank;
  }
  else 
  {
    args.item.system.damage.ap.bonus -= this.actor.system.advances.rank;
  }
}
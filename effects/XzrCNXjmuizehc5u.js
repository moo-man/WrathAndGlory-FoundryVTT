if (args.item.type == "weapon" && (args.item.system.isMelee || (args.item.system.isRanged && args.item.traitList.pistol)))
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
if (args.item.system.isRanged && args.item.system.isEquipped && args.item.name.includes("Shuriken"))
{
  args.item.system.salvo += this.actor.system.advances.rank;
}
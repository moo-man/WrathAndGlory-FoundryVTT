for(let armour of this.actor.itemTypes.armour)
{
  if (armour.traitList.powered)
  {
    
   armour.system.traits.list = armour.system.traits.list.filter(i => i.name != "powered")
  }
}
if (this.actor.itemTypes.armour.find(i => i.system.isEquipped))
{ 
  this.actor.combat.resilience.armour += 2;
  this.actor.combat.resilience.total += 2;
}
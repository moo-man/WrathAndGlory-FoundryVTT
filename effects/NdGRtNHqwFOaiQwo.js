let armour = this.actor.items.get(this.item.getFlag("wrath-and-glory", "applied"));

if (this.actor.system.combat.fly && armour?.system.isEquipped)
{
  this.actor.system.combat.fly = Math.max(0, this.actor.system.combat.fly - 2)
}
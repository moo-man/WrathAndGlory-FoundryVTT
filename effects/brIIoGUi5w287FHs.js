if (this.actor.itemTypes.armour.some(i => i.system.equipped))
{
    this.actor.system.combat.resilience.bonus -= 1;
}
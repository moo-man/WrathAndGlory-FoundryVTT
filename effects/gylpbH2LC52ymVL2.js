let armour = 4 + (this.effect.sourceTest?.result?.armour || 0)

let diff = armour - this.actor.system.combat.resilience.armour;

if (diff > 0)
{
  this.actor.system.combat.resilience.armour += diff;
  this.actor.system.combat.resilience.total += diff;
}

this.actor.system.combat.resilience.invulnerable = true;
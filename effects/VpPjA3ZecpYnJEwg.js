if (args.weapon.system.isMelee)
{
  args.result.text[this.effect.id] = {label : this.effect.name, description : `First ${this.actor.system.advances?.rank || 1} Wounds require 2 Icons when rolling Determination`};

}
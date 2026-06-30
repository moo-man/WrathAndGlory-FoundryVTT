if (args.weapon.system.isMelee && args.result.isWrathCritical)
{
  args.result.text[this.effect.id] = {label: this.effect.name, description: "Can roll twice on Critical Hit table and select best result (if using Axe of Dismemberment."};
}
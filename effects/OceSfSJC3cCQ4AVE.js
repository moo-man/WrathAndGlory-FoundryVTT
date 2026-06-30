if (args.test?.result.isWrathCritical && args.test?.weapon?.system.isMelee)
{ 
  args.modifiers.mortal.push({value: 2, label: this.effect.name})
}
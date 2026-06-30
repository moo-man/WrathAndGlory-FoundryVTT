if (!args.actor.hasCondition('exhausted') && args.test?.result.isWrathCritical) 
{ 
  args.modifiers.shock.push({label : this.effect.name + ` (Agonising)`, value : args.wounds})
}
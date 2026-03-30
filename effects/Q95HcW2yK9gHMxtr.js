if (!args.actor.hasCondition('exhausted') && args.actor.hasKeyword("PSYKER")) 
  args.modifiers.shock.push({label : this.effect.name + ` (Agonising)`, value : args.wounds})

this.actor.setupGenericTest("corruption", {fields: {difficulty: 9}, appendTitle: ` - ${this.effect.name}`, skipTargets: true})
if (args.wounds && args.wounds < args.actor.system.advances.rank)
{
  if (await this.script.dialog(`Convert ${args.wounds} Wounds to Shock?`))
  {
    args.report.breakdown.push(`<strong>${this.effect.name}</strong>: Converted ${args.wounds} Wounds to Shock`)
    args.shock += args.wounds;
    args.wounds = 0;
  }
}

if (args.shock)
{ 
  args.modifiers.shock.push({value: -1, label: this.effect.name})
}
if (args.test?.result.isWrathCritical && args.test?.item?.system.isMelee)
{
	args.modifiers.mortal.push({label : this.effect.name, value : this.actor.system.advances.rank * 2})
}
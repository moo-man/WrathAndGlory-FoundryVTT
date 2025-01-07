if (args.test?.result.isWrathCritical && args.test?.item?.system.isMelee)
{
	args.modifiers.mortal.push({label : this.effect.name, value : 4})
}
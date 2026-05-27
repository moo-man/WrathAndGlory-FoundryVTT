if (args.test?.result.isWrathCritical && (args.actor.system.isMob || args.actor.effects.contents.find(i => i.isCondition)))
{
	args.modifiers.mortal.push({label : this.effect.name, value : 2})
}
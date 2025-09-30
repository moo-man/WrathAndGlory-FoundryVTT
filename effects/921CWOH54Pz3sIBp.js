if (args.isSuccess && args.targetTokens.map(i => i.actor).filter(i => i).some(a => a.system.mob?.value))
{
	args.result.success += this.actor.system.advances.rank
	args.result.text[this.effect.id] = {label : this.effect.name, description : `Added ${this.actor.system.advances.rank} Icons`}
}
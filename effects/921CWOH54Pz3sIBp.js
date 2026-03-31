if (args.result.isSuccess && args.targetTokens.map(i => i.actor).filter(i => i).some(a => a.system.mob?.value))
{
	let rank = this.actor.system.advances?.rank || 1;
	args.result.success += rank;
	args.result.text[this.effect.id] = {label : this.effect.name, description : `Added ${rank} Icons`}
}
if (args.weapon?.system.isMelee)
{
	args.result.text[this.effect.id] = {label : this.effect.name, description : `Can reroll ${this.effect.sourceActor.system.advances.rank} failed dice once per attack`}
}
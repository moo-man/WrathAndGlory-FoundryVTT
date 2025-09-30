if (args.weapon?.system.isRanged)
{
	args.result.text[this.effect.id] = {label : this.effect.name, description : `Can reroll ${this.actor.system.advances.rank} failed dice once per test`}
}
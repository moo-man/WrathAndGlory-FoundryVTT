if (this.actor.hasCondition("staggered"))
{

let resisted = await this.effect.resistEffect();

if (resisted)
{
	this.actor.removeCondition("staggered");
}

}
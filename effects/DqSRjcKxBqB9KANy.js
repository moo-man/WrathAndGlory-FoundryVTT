let staggered = this.actor.hasCondition("staggered");

if (staggered)
{
	await staggered.delete();
	this.script.notification("Immune to Staggered");
}
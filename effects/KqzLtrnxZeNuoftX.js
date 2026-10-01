let exhausted = this.actor.hasCondition("exhausted");

if (exhausted)
{
	await exhausted.delete();
	this.script.notification("Removed Exhausted");
}
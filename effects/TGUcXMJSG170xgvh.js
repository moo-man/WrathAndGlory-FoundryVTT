let bleeding = this.actor.hasCondition("bleeding");

if (bleeding)
{
	await bleeding.delete();
	this.script.notification("Removed Bleeding");
}
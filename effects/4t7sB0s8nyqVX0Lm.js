let pinned = this.actor.hasCondition("pinned");

if (pinned)
{
	await pinned.delete();
	this.script.notification("Immune to Pinned");
}
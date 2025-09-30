let hindered = this.actor.hasCondition("hindered");

if (hindered)
{
	await hindered.delete();
	this.script.notification("Immune to Hindered");
}
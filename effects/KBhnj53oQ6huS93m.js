let fear = this.actor.hasCondition("fear");
let terror = this.actor.hasCondition("terror");

if (fear)
{
	this.script.notification("Removed Fear");
}
if (terror)
{
	this.script.notification("Removed Terror");
}

fear?.delete();
terror?.delete();
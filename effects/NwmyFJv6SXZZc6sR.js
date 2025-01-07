let dying = this.actor.hasCondition("dying")
if (dying)
{
	await dying.delete();
	await this.actor.update({"system.combat.wounds.value": this.actor.system.combat.wounds.max - 1})
     	await this.effect.update({"disabled" : true});
	this.script.notification("Prevented Dying");
}
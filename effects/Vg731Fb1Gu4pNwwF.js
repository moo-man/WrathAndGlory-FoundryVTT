if (!this.actor.items.get(this.item.getFlag(game.system.id, "shield")))
{
  	this.script.notification("No assigned Shield found.");
	args.abort = true;
}
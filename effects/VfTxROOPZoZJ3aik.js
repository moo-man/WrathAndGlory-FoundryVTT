let attributes = ItemDialog.objectToArray(game.wng.config.attributes, this.effect.img);

let lowest = Math.min(...attributes.map(i => this.actor.system.attributes[i.id].total))

let choices = attributes.filter(i => this.actor.system.attributes[i.id].total == lowest);

let attribute = await ItemDialog.create(choices, 1, {title : this.effect.name, text : "Choose Attribute Bonus"})

if (attribute[0])
{
	let changes = this.effect.changes.concat([]);
	changes[0].key = `system.attributes.${attribute[0].id}.bonus`
	this.effect.updateSource({changes});
}
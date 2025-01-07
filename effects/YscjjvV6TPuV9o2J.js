let attribute = await ItemDialog.create(ItemDialog.objectToArray(game.wng.config.attributes, this.effect.img), 1, {title : this.effect.name, text : "Choose Attribute Bonus"})

if (attribute[0])
{
	let changes = this.effect.changes.concat([]);
	changes[0].key = `system.attributes.${attribute[0].id}.bonus`
	this.effect.updateSource({changes});
}
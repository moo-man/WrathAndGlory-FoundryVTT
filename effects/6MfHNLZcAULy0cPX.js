let attribute = await ItemDialog.create(ItemDialog.objectToArray(systemConfig().attributes, this.effect.img), 1, {title : this.effect.name})

if (attribute[0])
{
	this.item.updateSource({name : this.item.name.replace("Attribute", attribute[0].name)});
	this.effect.updateSource({name : this.item.name, "flags.wrath-and-glory.attribute" : attribute[0].id})
}
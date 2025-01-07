let effects = this.item.effects.contents.filter(i => i.id != this.effect.id);

let choice = await ItemDialog.create(effects, 1, {title : this.effect.name, text: this.script.name});

if (choice[0])
{
	this.item.updateSource({name : this.item.name.replace("Trait", choice[0].name)});
	choice[0].updateSource({name : `Uncanny [${choice[0].name}]`, "system.transferData.type" : "document"})
}
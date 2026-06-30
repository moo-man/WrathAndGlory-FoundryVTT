let effects = this.item.effects.contents.filter(i => i.id != this.effect.id);

if (this.actor.hasKeyword("PSYKER"))
{
	effects = effects.filter(i => i.name != "Khorne")
}

let choice = await ItemDialog.create(effects, 1, {title : this.effect.name, text: this.script.name});

if (choice[0])
{
	let keyword = this.actor.itemTypes.keyword.find(i => i.name == "[MARK OF CHAOS]");

	if (keyword && choice[0].name != "Undedicated")
	{
		keyword.update({name : choice[0].name.toUpperCase()});
	}
	this.item.updateSource({name : this.item.name + ` [${choice[0].name}]`});
	choice[0].updateSource({name : `Mark of ${choice[0].name}`, "system.transferData.type" : "document"})
	await choice[0]._preCreate(args.data, args.options, args.user);
}
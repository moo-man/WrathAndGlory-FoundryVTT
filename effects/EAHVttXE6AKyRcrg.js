let effects = this.item.effects.contents.filter(i => i.id != this.effect.id);

let choice = await ItemDialog.create(effects, 1, {title : this.effect.name, text: this.script.name});

if (choice[0])
{
  	let keyword = this.actor.itemTypes.keyword.find(i => i.system.group == "MARK OF CHAOS");

	if (keyword && choice[0].name != "Undedicated")
	{
		await keyword.update({name : choice[0].name.toUpperCase()});
	}
  
  	await this.item.update({name : this.item.name + ` [${choice[0].name}]`});
    await this.effect.update({"system.transferData.type" : "other"});
	choice[0].update({name : `Mark of ${choice[0].name}`, "system.transferData.type" : "document"});
    await choice[0].handleImmediateScripts();
}
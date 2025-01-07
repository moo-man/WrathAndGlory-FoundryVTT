if (this.item.name.includes("Keyword"))
{
	let choice = await ValueDialog.create({text: "Enter Loremaster Keyword", title : this.effect.name});
	if (choice)
	{
		this.item.updateSource({name : this.item.name.replace("Keyword", choice.toUpperCase())});
		this.effect.updateSource({name : this.item.name});
	}
}
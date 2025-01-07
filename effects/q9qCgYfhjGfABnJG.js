if (this.item.name.includes("Any"))
{
	let choice = await ValueDialog.create({text: "Enter Hatred Keyword", title : this.effect.name});
	if (choice)
	{
		this.item.updateSource({name : this.item.name.replace("Any", choice.toUpperCase())});
		this.effect.updateSource({name : this.item.name});
	}
}
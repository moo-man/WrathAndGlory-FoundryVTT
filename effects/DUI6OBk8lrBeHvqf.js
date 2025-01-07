let img = this.item.img;
let choice = await ItemDialog.create([{id : "WS", name : "Weapon Skill", img}, {id : "BS", name : "Ballistic Skill", img}])

if (choice[0])
{
	this.item.updateSource({name : this.item.name + ` [${choice[0].id}]`});
}
let weapons = this.actor.itemTypes.weapon;

let choice = await ItemDialog.create(weapons, 1, {title : this.effect.name});

if (choice[0])
{
	this.effect.update({name : this.effect.baseName + ` [${choice[0].name}]`, "flags.wrath-and-glory.trademarkId" : choice[0].id});
}
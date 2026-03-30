let weapons = await Promise.all(["Compendium.wng-voa.items.Item.05I6eb9V432sn36H","Compendium.wng-voa.items.Item.dkCPyGqjLVKi8Sj8", "Compendium.wng-core.items.Item.2eNeTr0rwZ095NOE"].map(fromUuid));

let choice = await ItemDialog.create(weapons, 1, {title : this.effect.name, text: "Choose Weapon to receive and associate with Hellblaster Doctrine."});

if (choice[0])
{
	this.effect.updateSource({name : this.effect.setSpecifier(choice[0].name)});
  if (!this.actor.items.getName(choice[0].name))
  { 
    Item.implementation.create(choice[0].toObject(), {parent: this.actor})
    this.script.notification("Received " + choice[0].name)
  }
}
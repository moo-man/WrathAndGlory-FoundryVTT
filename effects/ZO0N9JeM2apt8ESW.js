let weapons = await Promise.all(["Compendium.wng-voa.items.Item.Fcw74q1JE7NIZkIo","Compendium.wng-core.items.Item.2HLUm6pMikdNfMlG", "Compendium.wng-core.items.Item.x1Ouy4jFDseOnm26", "Compendium.wng-core.items.Item.Ir3TL7qFOrdSzgJs", "Compendium.wng-core.items.Item.Fq7YlyhxjbOjOR9H", "Compendium.wng-core.items.Item.MrX6ET197CT2qEYF"].map(fromUuid));

let choice = await ItemDialog.create(weapons, 1, {title : this.effect.name, text: "Choose Weapon to receive and associate with Devastator Doctrine."});

let armour = await fromUuid("Compendium.wng-voa.items.Item.mHJJk8bjPvNr9cgY");

if (!this.actor.items.getName(armour.name));
{
  choice.push(armour);
}

if (choice.length)
{
	this.effect.updateSource({name : this.effect.setSpecifier(choice[0].name)});
  this.actor.createEmbeddedDocuments("Item", choice);
  this.script.notification("Received " + choice.map(i => i.name).join(", "));
}
let weapons = await Promise.all(["Compendium.wng-voa.items.Item.QD9bYGGLcWiC6YKf","Compendium.wng-voa.items.Item.aBow8oPJsyS3zgt6"].map(fromUuid));

let choice = await ItemDialog.create(weapons, 1, {title : this.effect.name, text: "Choose Weapon to receive and associate with Eradicator Doctrine."});

if (choice[0])
{
	this.effect.updateSource({name : this.effect.setSpecifier(choice[0].name)});
  if (!this.actor.items.getName(choice[0].name))
  { 
    Item.implementation.create(choice[0].toObject(), {parent: this.actor})
    this.script.notification("Received " + choice[0].name)
  }
}

let armour = await fromUuid("Compendium.wng-voa.items.Item.LhxQlnGltnsZ3WTo");
if (armour)
{
  this.actor.createEmbeddedDocuments("Item", [armour])
}
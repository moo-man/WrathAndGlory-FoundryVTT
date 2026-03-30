let weapons = await Promise.all(["Compendium.wng-voa.items.Item.AyNrH7atsSdoFTk5","Compendium.wng-voa.items.Item.Pw4dIa0wrXSjlrNm", "Compendium.wng-voa.items.Item.Iq1RQGj3pxU0QJyq"].map(fromUuid));

let choice = await ItemDialog.create(weapons, 1, {title : this.effect.name, text: "Choose Weapon to receive and associate with Heavy Intercessor Doctrine."});

if (choice[0])
{
	this.effect.updateSource({name : this.effect.setSpecifier(choice[0].name)});
  if (!this.actor.items.getName(choice[0].name))
  { 
    await Item.implementation.create(choice[0].toObject(), {parent: this.actor})
    this.script.notification("Received " + choice[0].name)
  }
}

this.actor.addEffectItems("Compendium.wng-voa.items.Item.OkjWj93bw1WPcMb9", this.effect)
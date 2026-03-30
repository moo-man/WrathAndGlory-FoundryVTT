let weapons = await Promise.all(["Compendium.wng-voa.items.Item.OkjWj93bw1WPcMb9","Compendium.wng-voa.items.Item.rwpQKxRmLOxsr7si", "Compendium.wng-voa.items.Item.s0NatpS54AoENCyf"].map(fromUuid));

let choice = await ItemDialog.create(weapons, 1, {title : this.effect.name, text: "Choose Talent to receive."});

let talents = await Promise.all([fromUuid("Compendium.wng-core.items.Item.caUknJMvhWAcEDbz")]);

if (choice[0])
{
  talents.push(choice[0]);
}

await this.actor.createEmbeddedDocuments("Item", talents);

let item = await DragDialog.create({title: this.effect.name, text: "Choose 1 Uncommon Wargear", filter: (i) => i.system.rarity == "uncommon", onError: "Must be Uncommon rarity"});

if (item)
{
  await this.actor.createEmbeddedDocuments("Item", [item]);
}
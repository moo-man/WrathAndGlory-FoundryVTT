let gear = await Promise.all(["Compendium.wng-voa.items.Item.8h72b899Kbwvcnpw","Compendium.wng-core.items.Item.rgcz2ZC60MEM8mao", "Compendium.wng-voa.items.Item.mHJJk8bjPvNr9cgY", "Compendium.wng-core.items.Item.fYcfZQb8Um0jf6mK"].map(fromUuid));

gear = gear.filter(i => !this.actor.items.getName(i.name))

this.script.notification(`Added ${gear.map(i => i.name).join(", ")}`);

await this.actor.createEmbeddedDocuments("Item", gear);
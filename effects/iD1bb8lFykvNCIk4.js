let items = ["Compendium.wng-core.items.Item.JVz6FoVEc7p1DJUj", "Compendium.wng-core.items.Item.n0bj5UJjgglDzFcB", "Compendium.wng-core.items.Item.EkYPs1ktKn4EaGFq", "Compendium.wng-core.items.Item.qZ1MhJjRIuxJxEF7"];

let minor = await Promise.all(["Compendium.wng-core.items.KlfSjb1rKKdlYFhc",
"Compendium.wng-core.items.jbIQTvBy7CwO2h5z",
"Compendium.wng-core.items.9AnDpmrRMN5HuerR",
"Compendium.wng-core.items.hR56lZzY4JEW2JPC",
"Compendium.wng-core.items.oIHSFm0K5bAMjIvi",
"Compendium.wng-core.items.osDMPEt7SXTRS7bS",
"Compendium.wng-core.items.3FHZYIJhjgW9IIWB",
"Compendium.wng-core.items.49mSzarl5rOSp2Cb",
"Compendium.wng-core.items.I3705lKAu41owyp3",
"Compendium.wng-core.items.sNtFVD9vHeZmrRO4",
"Compendium.wng-core.items.cb8NYMnLIkt8dp4j",
"Compendium.wng-core.items.pITmVVUIbdcsigzp",
"Compendium.wng-core.items.XaPBgatbPT7tqArI",
"Compendium.wng-core.items.rLmWz3gH7TBmf5IH"].map(fromUuid))

let choice = await ItemDialog.create(minor, 1, {title : this.effect.name, text : "Choose 1 Minor Psychic Power"});

if (choice[0])
{
    items.push(choice[0].uuid);
}


this.actor.createEmbeddedDocuments("Item", (await Promise.all(items.map(fromUuid))), {fromEffect: this.effect.id})
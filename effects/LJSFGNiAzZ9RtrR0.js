let items = ["Compendium.wng-core.items.Item.JVz6FoVEc7p1DJUj", "Compendium.wng-core.items.Item.n0bj5UJjgglDzFcB"];

let minor = await Promise.all(["Compendium.wng-core.items.uQKBlm3iW0GYDy83",
"Compendium.wng-core.items.33nu3kaw8zNOPx8h",
"Compendium.wng-core.items.ehGa28RU82KxCDrZ",
"Compendium.wng-core.items.qPAsmaoh7YuxMAbt",
"Compendium.wng-core.items.6uxTxs8yqfJygqsG",
"Compendium.wng-core.items.rWQj4yseWbT0ffSf"].map(fromUuid))

let choice = await ItemDialog.create(minor, 1, {title : this.effect.name, text : "Choose 1 Rune of Battle Power"});

if (choice[0])
{
    items.push(choice[0].uuid);
}


this.actor.createEmbeddedDocuments("Item", (await Promise.all(items.map(fromUuid))), {fromEffect: this.effect.id});
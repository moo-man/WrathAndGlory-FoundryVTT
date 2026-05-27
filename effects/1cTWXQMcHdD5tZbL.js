let items = ["Compendium.wng-core.items.Item.JVz6FoVEc7p1DJUj", "Compendium.wng-core.items.Item.n0bj5UJjgglDzFcB", "Compendium.wng-core.items.Item.EkYPs1ktKn4EaGFq", "Compendium.wng-core.items.Item.qZ1MhJjRIuxJxEF7"];

let choice = await game.wng.utility.disciplinePowerDialog("Minor", {text: "Choose one Minor Psychic Power", title: this.item.name})

if (choice[0])
{
    items.push(choice[0].uuid);
}

this.actor.addEffectItems(items, this.effect);
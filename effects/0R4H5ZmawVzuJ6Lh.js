let items = ["Compendium.wng-core.items.Item.JVz6FoVEc7p1DJUj", "Compendium.wng-core.items.Item.n0bj5UJjgglDzFcB"];

this.actor.createEmbeddedDocuments("Item", (await Promise.all(items.map(fromUuid))), {fromEffect: this.effect.id})
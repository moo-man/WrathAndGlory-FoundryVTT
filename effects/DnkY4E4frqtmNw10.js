let item = (await fromUuid("Compendium.wng-core.items.Item.HSTXKR5NVmndHpOT")).toObject();

item.system.equipped = true;

this.actor.createEmbeddedDocuments("Item", [item], {fromEffect : this.effect.id})
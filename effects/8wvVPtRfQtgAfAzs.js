if (!this.actor.hasKeyword("PSYKER"))
{


let keyword = await fromUuid("Compendium.wng-core.items.Item.JVz6FoVEc7p1DJUj");

this.actor.createEmbeddedDocuments("Item", [keyword], {fromEffect: this.effect.id})

}
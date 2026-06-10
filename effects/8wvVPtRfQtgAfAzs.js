if (!this.actor.hasKeyword("PSYKER"))
{
    let keyword = await fromUuid("Compendium.wng-core.items.Item.JVz6FoVEc7p1DJUj");

    this.actor.createEmbeddedDocuments("Item", [keyword], {fromEffect: this.effect.id})
}
else 
{
    let power = await game.wng.utility.disciplinePowerDialog("Minor", {text: "Select Minor Power", title: this.effect.name, number: 1})
    if (power.length)
    {
        this.actor.createEmbeddedDocuments("Item", power, {fromEffect: this.effect.id})
    }
}
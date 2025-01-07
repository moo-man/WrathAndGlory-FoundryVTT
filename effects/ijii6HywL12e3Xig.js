if (!this.item.name.includes("(")) 
{
    let name = this.item.name

    let choice = await ItemDialog.create(ItemDialog.objectToArray({
        taste: "Taste",
        sight: "Sight",
        smell: "Smell",
        hearing: "Hearing",
        touch: "Touch"
    }, this.item.img), 1, { title: this.item.name, text: "Choose Sense" });

    if (choice[0]) {
        name += ` (${choice[0].name})`
    }
    this.item.updateSource({ name })
    this.effect.updateSource({ name })
}
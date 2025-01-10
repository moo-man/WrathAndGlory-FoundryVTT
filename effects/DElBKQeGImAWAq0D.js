let choices = {
    "WnUnoeuEiLw2mrFW" : "Auger",
    "night" : "Night",
    "pr" : "Pict Recorder",
    "Ag7dmK8T7pUJDw70" :  "Reticule",
    "telescopic" : "Telescopic"
}

let choice = await ItemDialog.create(ItemDialog.objectToArray(choices, this.item.img), 1, {title : this.effect.name});

if (choice[0])
{
    this.item.updateSource({name : this.item.setSpecifier(choice[0].name)})

    let effect = this.item.effects.get(choice[0].id);
    if (effect)
    {
        effect.updateSource({"system.transferData.type" : "document"});
    }
}
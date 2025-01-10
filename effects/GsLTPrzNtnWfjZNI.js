let options = {
    "Lop10kNQQknnWVFU" : "Auger",
    "night" : "Night",
    "pr" : "Pict Recorder",
    "2GF8GkN2B8ZjEpzc" :  "Reticule",
    "telescopic" : "Telescopic"
}

let choices = await ItemDialog.create(ItemDialog.objectToArray(options, this.item.img), 2, {title : this.effect.name, text : this.script.label});

if (choices.length)
{
    this.item.updateSource({name : this.item.setSpecifier(choices.map(i => i.name).join(", "))});
    for(let choice of choices || [])
    {
        let effect = this.item.effects.get(choice.id);
        if (effect)
        {
            effect.updateSource({"system.transferData.type" : "document"});
        }
    }
}
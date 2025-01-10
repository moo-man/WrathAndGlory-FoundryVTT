let choices = {auspex : "Auspex", diagnostor : "Diagnostor"};

let choice = await ItemDialog.create(ItemDialog.objectToArray(choices, this.item.img), 1, {title : this.effect.name});

if (choice[0])
{
    this.item.update({name : this.item.setSpecifier(choice[0].name)})

    if (choice[0].id == "diagnostor")
    {
        let effect = (await fromUuid("Compendium.wng-core.items.Item.eVKhnZo0ekm7DobY.ActiveEffect.GR27J3id8TyLcNfN")).toObject();
        effect.img = this.item.img;
        this.item.update({effects : [effect]});
    }
}

this.effect.delete();
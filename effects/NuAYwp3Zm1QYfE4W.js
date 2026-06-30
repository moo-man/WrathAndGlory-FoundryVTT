let item = await DragDialog.create({text: "Provide Weapon", title: this.effect.name, filter: (i) => i.type == "weapon"});

if (item)
{
  let system = item.system.toObject();
  delete system.description;
  this.item.update({
    name: this.item.setSpecifier(item.name),
    system
  })
}
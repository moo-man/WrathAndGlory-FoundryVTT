let armour = this.actor.itemTypes.armour.filter(i => i.hasKeyword("POWERED", "ADEPTUS ASTARTES"));

if (!armour.length)
{
  return this.script.notification("No applicable armour!", "error")
}
else 
{
  let choice = await ItemDialog.create(armour, 1, {title: this.effect.name, text: "Choose Armour to apply to"})

  await this.item.update({name: this.item.setSpecifier(choice[0].name), "flags.wrath-and-glory.applied": choice[0].id})
}
let shields = this.actor.itemTypes.armour.filter(i => i.system.traits.has("shield"));

if (!shields.length)
{
  this.script.notification("This Actor does not own any Shields.", "error")
}

let chosen = await ItemDialog.create(shields, 1, {text : "Select Shield", title : this.effect.name});

if (chosen[0])
{
  await this.item.update({name : this.item.setSpecifier(chosen[0].name)})
 this.item.setFlag(game.system.id, "shield", chosen[0].id);
}
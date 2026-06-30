let item = await DragDialog.create({text: "Provide Bladed Melee Weapon", title: this.effect.name, filter: (i) => i.type == "weapon" && i.hasKeyword("BLADE"), onError: "Must be a bladed melee weapon"});

if (item)
{
  this.item.update({
    name: this.item.setSpecifier(item.name),
    system: {
      damage: {
        base: item.system.damage.base + 4,
        ed: {
          base: item.system.damage.ed.base + 4
        },
        ap: item.system.damage.ap,
        otherDamage: item.system.damage.otherDamage
      },
      range: item.system.range,
      category: item.system.category,
      traits: item.system.traits,
    }
  })
}
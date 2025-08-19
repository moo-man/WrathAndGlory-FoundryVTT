let effects = this.item.effects.contents.filter(i => i.id != this.effect.id);

let choice = await ItemDialog.create(effects, 1, {title : this.effect.name, text: this.script.name});

if (choice[0])
{
  this.item.update({"flags.wrath-and-glory.protocol" : choice[0].id})
}
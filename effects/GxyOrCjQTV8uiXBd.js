let effects = this.effect.sourceItem.effects.contents.filter(i => i.id != this.effect.id);

if (this.actor.name === "Aberrant")
{
  let choice = await ItemDialog.create(effects, 1, {title : this.effect.name, text: this.script.name});

  if (choice[0])
  {
    this.actor.applyEffect({effectUuids: choice[0].uuid});
  }
}
else
{
  let roll = await new Roll("1d3").roll();

  roll.toMessage(this.script.getChatData());

  let chosenEffect = effects[roll.total-1];
  this.actor.applyEffect({effectUuids: chosenEffect.uuid});
}
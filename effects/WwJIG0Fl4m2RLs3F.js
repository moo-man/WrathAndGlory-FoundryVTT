let god = this.actor.getGroupKeyword("MARK OF CHAOS").map(i => i.toUpperCase())[0];

if (!god)
{
  god = await ValueDialog.create({text: "No Mark of Chaos found, select manually", title: this.effect.name}, "", ["KHORNE", "NURGLE", "SLAANESH", "TZEENTCH"]);
}

if (god)
{
  let effect = this.item.effects.contents.find(i => i.specifier?.toUpperCase() == god);
  effect.updateSource({"system.transferData.type" : "aura"});
}
let effect = this.effect.sourceItem.effects.get("EEyodz3VDJ7w0gZq").toObject();
for(let item of this.effect.system.itemTargets)
{
  ActiveEffect.create(effect, {parent: item});
}
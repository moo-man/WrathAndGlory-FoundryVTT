if (this.effect.sourceActor.uuid == this.actor.uuid)
{
  return;
}

args.modifiers.mortal.push({value: this.effect.sourceTest.actor.system.advances.rank,label: this.effect.name });

this.effect.update({disabled: true});
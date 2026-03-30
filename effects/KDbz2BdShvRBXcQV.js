let keyword = this.effect.sourceActor.getGroupKeyword("CHAPTER", {item: true});
if (keyword)
{ 
  this.actor.addEffectItems(keyword?.uuid, this.effect);
}
if (game.counter.glory && args.test.weapon?.traitList.melta)
{ 
  let spent = await ValueDialog.create({text : `Spend up to ${this.actor.system.advances.rank} Glory to add +ED`, title: this.effect.baseName}, 0);
  spent = Math.clamp(spent, 0, Math.min(game.counter.glory, this.actor.system.advances.rank))

  if (spent)
  { 
    game.counter.change(-spent, "glory");
    this.script.message(`Spent ${spent} Glory.`)
    args.modifiers.ed.push({value: spent, label: this.effect.name})
  }
}
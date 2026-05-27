if (game.counter.glory)
{
  game.counter.change(-1, "glory");
  this.actor.update({"system.resources.wrath" : this.actor.system.resources.wrath + 1})
  this.script.message("Spent Glory to gain Wrath")
}
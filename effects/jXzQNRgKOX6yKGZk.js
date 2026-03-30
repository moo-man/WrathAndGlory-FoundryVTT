if (game.counter.glory >= 1)
{
  this.script.notification("Spent 1 Glory To Ignore All Damage");
  RuinGloryCounter.changeCounter(-1,  "glory")

  return true
}
else 
{
  this.script.notification("Not enough Glory", "error");
}
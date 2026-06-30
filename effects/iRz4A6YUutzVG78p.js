if (args.wounds + args.mortal > 0)
{
  game.counter.change("ruin", 1);
  this.script.notification("Gained 1 Ruin");
}
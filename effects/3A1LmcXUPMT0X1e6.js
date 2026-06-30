let wounds = args.wounds + args.mortal;

if (wounds > 0 && args.test?.power)
{
  let heal;
  if (this.actor.type == "agent" && this.actor.hasPlayerOwner && game.counter.glory)
  {
    if (await this.script.dialog(`Spend Glory to recover ${wounds} Wounds?`))
    {
      game.counter.change(-1, "glory");
      this.script.message("Spent Glory");
      heal = true;
    }
  }
  else if (game.counter.ruin)
  {
    if (await this.script.dialog(`Spend Ruin to recover ${wounds} Wounds?`))
    {
      game.counter.change(-1, "ruin");
      this.script.message("Spent Ruin");
      heal = true;
    }
  }
  if (heal)
  {
    this.actor.applyHealing({wounds}, {messageData: this.script.getChatData()});
  }
}
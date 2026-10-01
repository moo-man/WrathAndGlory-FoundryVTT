if (game.counter.glory > 0 && !this.actor.statuses.has("living-bulwark"))
{ 
  let choice = await this.script.dialog("Spend Glory to ignore incoming Damage?");
  if (choice)
  {
    args.abort = this.effect.name;
    this.actor.applyEffect({effects: this.item.effects.get("kXY9dGcu5NGi0Mqp")})
  }
}
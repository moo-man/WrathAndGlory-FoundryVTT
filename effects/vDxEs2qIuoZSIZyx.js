if (args.mortal && this.actor.system.resources.wrath)
{
  if (await this.script.dialog("Spend Wrath to roll Determination against Mortal Wounds?"))
  {
    await this.actor.spend("system.resources.wrath")
    args.mortalDetermination = true;
  }
}
if (args.type == "data" && args.options.action == "update")
{
  if (foundry.utils.getProperty(args.data, "system.combat.wounds.value") < this.actor.system.combat.wounds.value)
  {
    this.script.notification("Cannot Heal!")
    if (this.actor.sheet.rendered)
    {
      this.actor.sheet.render({force: true}); // refresh sheet to see the real value
    }
    return false;
  }
}
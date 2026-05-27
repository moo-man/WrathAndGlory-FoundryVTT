if (args.wounds > 0)
{
  this.item.update({"system.equipped": false, name: this.item.setSpecifier("Broken")});
  this.script.notification("Broken!")
}
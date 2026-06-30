if (this.item.getFlag(game.system.id, "frequency") == "single")
{
  this.item.name = this.item.setSpecifier("Single Frequency");
}
else if (this.item.getFlag(game.system.id, "frequency") == "variable")
{
    this.item.name = this.item.setSpecifier("Variable  Frequency");
    this.item.system.damage.base = 11;
    this.item.system.damage.ed.base = 1;
    this.item.system.damage.ap.base = -1;
    this.item.system.range = {
      short: 12,
      medium: 24,
      long: 36
    },
    this.item.system.salvo = 6;
    this.item.system.traits.list = this.item.system.traits.list.filter(t => t.name != "brutal");
  
}
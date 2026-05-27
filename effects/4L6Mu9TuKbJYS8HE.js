if (args.type == "wrath")
{
   let wrath = args.dice.length;
   this.actor.update({"system.resources.wrath" : this.actor.system.resources.wrath + wrath})
   this.script.message(`Gained ${wrath} Wrath`);
}
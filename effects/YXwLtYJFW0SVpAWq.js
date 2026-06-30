let traits = [{name: "warpWeapons"}];
let god = this.effect.getFlag(game.system.id, "god");
switch(god)
{
    case "khorne" :
      traits.push({name: "inflict", rating: "Bleeding"});
      break;
    case "nurgle" :
      traits.push({name: "inflict", rating: "Poisoned 4"});
      break;
    case "slaanesh" :
      traits.push({name: "inflict", rating: "agonising"});
      break;
    case "tzeentch" :
      traits.push({name: "inflict", rating: "force"});
      break;
}

args.item.name = this.item.setSpecifier(god.capitalize() + " Daemon");
args.item.system.traits.list = args.item.system.traits.list.concat(traits);
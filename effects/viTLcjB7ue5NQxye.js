if (args.determination && args.result.shock)
{ 
args.result.shock = Math.max(0, args.result.shock - 1);
args.result.text[this.effect.id] = {label: this.effect.name, description: "Reduced Shock by 1"}
}
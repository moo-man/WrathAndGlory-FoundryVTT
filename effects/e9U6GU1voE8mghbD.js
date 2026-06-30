let exalted = args.damageRoll.result.dice.filter(i => i.result == 6).length;
let mortal = exalted * 1;
args.modifiers.mortal.push({label : this.effect.name, value : mortal})
let shock = -1 * this.effect.sourceTest.result.shock;
let wounds = -1 * this.effect.sourceTest.result.wounds;
args.modifiers.shock.push({label : this.effect.name, value : shock})
args.modifiers.wounds.push({label : this.effect.name, value : wounds})
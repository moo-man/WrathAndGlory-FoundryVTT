let shock = Math.ceil(CONFIG.Dice.randomUniform() * 3)

let add = 1 - this.effect.sourceTest.result.shock;

shock += add;

let tooltip = `1d3 (${shock}) + ${add}`

let report = await this.actor.applyDamage(0, {shock});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${tooltip}">Received ${report.shock} Shock</span>`);
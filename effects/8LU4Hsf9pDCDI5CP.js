let shockValue = Math.ceil(CONFIG.Dice.randomUniform() * 3 + this.effect.sourceTest.result.shockPotency);

let report = await this.actor.applyDamage(0, {shock: shockValue});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}">Received ${report.shock} Shock</span>`);
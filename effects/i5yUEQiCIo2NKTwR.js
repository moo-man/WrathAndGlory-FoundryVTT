let shock = Math.ceil(CONFIG.Dice.randomUniform() * 3);

let report = await this.actor.applyDamage(0, {shock});
this.script.message(`Received ${report.shock} Shock`);
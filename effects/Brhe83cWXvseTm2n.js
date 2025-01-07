let mortal = Math.ceil(CONFIG.Dice.randomUniform() * 6);
let report = await this.actor.applyDamage(0, {mortal});
this.script.message(`Received ${report.wounds} Wounds and ${report.shock} Shock</span>`)
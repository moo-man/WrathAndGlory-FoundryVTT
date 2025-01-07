let wounds = Math.ceil(CONFIG.Dice.randomUniform() * 3);
let report = await this.actor.applyDamage(0, {mortal:wounds});

this.script.message(`${this.actor.name} took ${report.mortal} Wounds`);
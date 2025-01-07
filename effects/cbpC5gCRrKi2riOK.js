let tens = Math.floor(this.actor.system.mob.value/10)+1;

let roll = await new Roll(`${tens}d3`).roll();

let report = await this.actor.applyDamage(0, {shock: roll.total});
this.script.message(`Received ${report.shock} Shock and ${report.wounds} Wounds`);
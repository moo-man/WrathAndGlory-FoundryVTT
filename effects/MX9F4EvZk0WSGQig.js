let roll = await new Roll(`1d3`).roll();
roll.toMessage(this.script.getChatData());
let report = await this.actor.applyDamage(0, {mortal : roll.total});
this.script.message(`Received ${report.wounds} Wounds`)
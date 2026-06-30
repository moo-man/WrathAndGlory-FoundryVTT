let roll = await new Roll(`1d3 + ${this.effect.sourceTest.result.mortal}`).roll();
roll.toMessage(this.script.getChatData());
let report = await this.actor.applyDamage(0, {mortal : roll.total});
await this.actor.update({"system.corruption.current" : this.actor.system.corruption.current + 1});
this.script.message(`Received ${report.wounds} Wounds and +1 Corruption`)
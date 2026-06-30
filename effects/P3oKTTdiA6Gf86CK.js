let roll = await new Roll(`1d6 + ${this.effect.sourceTest.result.shock}`).roll();
roll.toMessage(this.script.getChatData());
let report = await this.actor.applyDamage(0, {shock : roll.total});
this.script.message(`Received ${report.shock} Shock`)
let roll = await new Roll("1d3 + " + this.effect.sourceTest.result.shockAndCorruption).roll();
roll.toMessage(this.script.getChatData({flavor: "Corruption"}));

await this.actor.update({"system.corruption.current" : this.actor.system.corruption.current + roll.total});

let report = await this.actor.applyDamage(0, {shock: 2 + this.effect.sourceTest.result.shockAndCorruption});
this.script.message(`Received ${report.shock} Shock`)
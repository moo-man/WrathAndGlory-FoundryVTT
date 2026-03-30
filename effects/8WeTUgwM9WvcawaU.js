let shock = this.effect.sourceActor.uuid == this.actor.uuid ? 2 : 1;

shock -= (this.effect.sourceTest.result.reduceShock) || 0;

let report = await this.actor.applyDamage(0, {shock});

this.script.message(`Received ${report.shock} Shock`)
let report = await this.actor.applyDamage(0, {shock : this.effect.sourceTest.result.damage.other.shock});

this.script.message(`Received ${report.shock} Shock`)
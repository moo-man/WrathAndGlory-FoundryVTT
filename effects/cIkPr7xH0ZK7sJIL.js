let report = await this.actor.applyDamage(0, {shock : 1});
this.script.message(`Received ${report.shock} Shock`)
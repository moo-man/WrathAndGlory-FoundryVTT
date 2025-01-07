let report = await this.actor.applyDamage(0, {mortal: 1});
this.script.message(`Received ${report.wounds} Mortal Wound`);
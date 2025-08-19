let report = await this.actor.applyDamage(0, {mortal: this.effect.sourceActor.system.advances.rank});
this.script.message(`Received ${report.wounds} Mortal Wound`);
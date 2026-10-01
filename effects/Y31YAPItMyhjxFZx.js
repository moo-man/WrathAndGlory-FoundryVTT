let report = await this.actor.applyDamage(0, {shock: this.effect.sourceActor.system.advances.rank});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}">Received ${report.shock} Shock</span>`);
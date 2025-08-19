let report = await this.actor.applyDamage(0, {shock : 2 + (this.effect.sourceActor.system.advances.rank * 2)});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}">Received ${report.shock} Shock</span>`);
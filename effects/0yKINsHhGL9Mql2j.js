let report = await this.actor.applyDamage(0, {shock: 1});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}">Received ${report.shock} Shock</span>`);
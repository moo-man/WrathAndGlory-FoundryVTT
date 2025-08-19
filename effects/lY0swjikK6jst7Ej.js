let dice = await new Roll("1d3").roll();
dice.toMessage(this.script.getChatData());

let report = await this.actor.applyDamage(0, {mortal : dice.total + (this.effect.sourceActor.system.advances.rank)});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}">Received ${report.wounds} Mortal Wounds</span>`);
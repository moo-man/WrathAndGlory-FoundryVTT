let shock = Math.ceil(CONFIG.Dice.randomUniform() * 6);
let wounds = Math.ceil(CONFIG.Dice.randomUniform() * 3);

let healedShock = Math.floor(shock / 2);
let healedWounds = Math.floor(wounds / 2);

let report = await this.actor.applyDamage(wounds, {shock}, {allowDetermination : false});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}"> Received ${report.wounds} Wounds and ${report.shock} Shock</span>`)

this.effect.sourceActor.applyHealing({shock : healedShock, wounds : healedWounds}, {messageData : this.script.getChatData()})
let shock = Math.ceil(CONFIG.Dice.randomUniform() * 3);
let mortal = 0

if (this.effect.sourceActor.type == "agent")
{
	shock += this.effect.sourceActor.corruptionLevel || 0
}

let test = await this.actor.setupAttributeTest("toughness", {fields : {difficulty : 5}});

if (!test.result.isSuccess)
{
	mortal = Math.ceil(CONFIG.Dice.randomUniform() * 3);
}

let report = await this.actor.applyDamage(0, {mortal, shock});

this.script.message(`<span data-tooltip-direction="LEFT" data-tooltip="${report.breakdown}"> Received ${report.wounds} Wounds and ${report.shock} Shock</span>`)
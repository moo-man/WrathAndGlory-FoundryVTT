let roll = Math.ceil(CONFIG.Dice.randomUniform() * 3);

let shock = this.effect.sourceActor.system.advances.rank * 2 + roll;

this.actor.applyHealing({shock}, {messageData : this.script.getChatData()});
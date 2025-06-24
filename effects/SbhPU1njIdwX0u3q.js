let shock = Math.ceil(CONFIG.Dice.randomUniform() * 3);

this.actor.applyHealing({shock}, {messageData : this.script.getChatData()})
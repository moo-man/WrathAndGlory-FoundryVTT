let wound = 0 + this.effect.sourceTest.result.wound;
let shock = Math.ceil(CONFIG.Dice.randomUniform() * 3) + this.effect.sourceTest.result.shock;;


await this.actor.applyHealing({wounds: wound, shock: shock}, {messageData : this.script.getChatData()});
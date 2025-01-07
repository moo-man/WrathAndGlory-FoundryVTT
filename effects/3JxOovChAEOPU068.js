let wounds = Math.ceil(CONFIG.Dice.randomUniform() * 3)
let shock = Math.ceil(CONFIG.Dice.randomUniform() * 6);

await this.actor.applyHealing({wounds, shock}, {messageData : this.script.getChatData()});
let wounds = Math.ceil(CONFIG.Dice.randomUniform() * 3);

await this.actor.applyHealing({wounds, shock: 0}, {messageData : this.script.getChatData()});
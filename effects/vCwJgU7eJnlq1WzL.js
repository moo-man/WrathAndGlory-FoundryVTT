let roll = await new Roll("10dp").roll();
let icons = roll.dice[0].results.reduce((total, die) => total + die.value, 0);

await this.actor.applyHealing({wounds: icons, shock: 0}, {messageData : this.script.getChatData()});

roll.toMessage(this.script.getChatData());
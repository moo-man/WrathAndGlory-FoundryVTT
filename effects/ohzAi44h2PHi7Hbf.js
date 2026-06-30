if (this.actor.system.combat.wounds.value != 0);

const roll = await new Roll("2d3").roll();
await roll.toMessage(this.script.getChatData());

await this.actor.applyHealing({wounds: roll.total}, {messageData: this.script.getChatData()});
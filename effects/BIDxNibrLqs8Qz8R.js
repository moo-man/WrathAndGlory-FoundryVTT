if (!args.result.isWrathCritical) return;

const roll = await new Roll("1d3").roll();
await roll.toMessage(this.script.getChatData());
await this.actor.applyHealing({wounds: roll.total},{messageData: this.script.getChatData()});
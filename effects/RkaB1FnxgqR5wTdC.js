let heal = await new Roll("2d6").roll();
this.actor.applyHealing({wounds: heal.total}, {messageData: this.script.getChatData()})
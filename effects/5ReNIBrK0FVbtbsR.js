this.actor.applyHealing({wounds : this.actor.system.advances.rank}, {messageData : this.script.getChatData()});
game.counter.change(1, "ruin");
this.script.message("Gained 1 Ruin");
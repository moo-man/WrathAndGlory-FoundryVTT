let wounds = this.actor.system.advances.rank + this.effect.sourceTest.testData.shifted.wardenOfSouls?.dice.length || 0;
this.actor.applyHealing({wounds}, {messageData : this.script.getChatData()});
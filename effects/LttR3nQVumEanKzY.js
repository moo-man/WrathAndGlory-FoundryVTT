let roll = await new Roll("1d3 + " + this.effect.sourceTest.result.corruption).roll();
roll.toMessage(this.script.getChatData({flavor: "Corruption"}));
this.actor.update({"system.corruption.current" : this.actor.system.corruption.current + roll.total});
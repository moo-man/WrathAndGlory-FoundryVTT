let roll = await new Roll("1d3").roll();
roll.toMessage(this.script.getChatData());

this.effect.update({"changes.0" : {key : "system.attributes.intellect.bonus", mode : 2, value : roll.total}})
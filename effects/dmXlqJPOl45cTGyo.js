let roll = await new Roll("1d6").roll();
roll.toMessage(this.script.getChatData({flavor: "Duration"}));

this.effect.updateSource({"duration.rounds": roll.total})
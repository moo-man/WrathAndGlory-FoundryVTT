let corruption = 1 * Math.ceil(CONFIG.Dice.randomUniform() * 3);

this.script.notification("Gained " + corruption + " Corruption");

this.actor.update({"system.corruption.current" : this.actor.system.corruption.current + corruption})
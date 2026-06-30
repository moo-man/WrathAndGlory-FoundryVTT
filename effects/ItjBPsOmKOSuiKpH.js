const gain = Math.ceil((CONFIG.Dice.randomUniform() * 3)*3);

  await this.actor.update({
    "system.corruption.current": this.actor.system.corruption.current + gain
  });
this.script.notification(`${this.actor.name} gained ${gain} Corruption.`);
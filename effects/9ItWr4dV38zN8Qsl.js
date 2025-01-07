if (this.effect.sourceTest.testData.shifted.wounds)
{
  await this.actor.applyHealing({wounds: this.effect.sourceTest.testData.shifted.wounds.dice.length, shock: 0}, {messageData : this.script.getChatData()});
}
if (args.result.isSuccess)
{
	let shock = 1 + this.actor.system.advances.rank * 2 + (this.effect.sourceTest.testData.shifted.hardy.dice.length || 0)
	this.actor.applyHealing({shock}, {messageData : this.script.getChatData()})
}
else 
{
	this.actor.applyHealing({shock : 1}, {messageData : this.script.getChatData()})
}
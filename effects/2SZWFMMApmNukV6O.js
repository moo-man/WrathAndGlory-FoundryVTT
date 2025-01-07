if (this.actor.type == "agent")
{
	this.actor.update({"system.corruption.current" : this.actor.system.corruption.current + this.effect.sourceTest.result.corruption})
}

let table = await fromUuid("RollTable.5jY4Qiah2VaLmBVT");

let result = await table.roll()

let uuid = `Compendium.${result.results[0].documentCollection}.${result.results[0].documentId}`;

this.actor.addEffectItems(uuid, this.effect)

this.script.notification(`Added ${this.effect.sourceTest.result.corruption} Corruption and ${result.results[0].text}`)
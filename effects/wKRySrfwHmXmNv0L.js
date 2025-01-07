let actor = this.effect.sourceActor;

let hatred = actor?.items.find(i => i.baseName == "Hatred");

if (hatred)
{
	this.effect.updateSource({"name" : hatred.name})
}
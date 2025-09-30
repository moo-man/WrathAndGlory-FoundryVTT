let actor = await DragDialog.create({ text: "Provide Cyber-Mastiff Actor", title: this.effect.name, filter: (actor) => actor.documentName == "Actor", onError: "Must provide an Actor" })

if (!actor.prototypeToken.actorLink)
{
    ui.notifications.warn("It is recommended the Cyber-Mastiff is a linked Actor (Link Actor Data checked)", {permanent: true})
}
await this.effect.setFlag(game.system.id, "mastiff", actor.uuid);
let effectData = this.item.effects.contents[0].convertToApplied();
effectData.name += ` (${this.actor.name})`
actor.applyEffect({effectData})
await this.effect.update({name : this.effect.baseName + ` (${actor.name})`})
await this.item.update({name : this.item.baseName + ` (${actor.name})`})
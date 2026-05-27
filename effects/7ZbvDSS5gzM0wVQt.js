if (args.type == "data" && args.data.system?.needsReload == false)
{
  this.script.notification("Removed")
  this.actor.deleteEmbeddedDocuments("ActiveEffect", [this.effect.id])
}
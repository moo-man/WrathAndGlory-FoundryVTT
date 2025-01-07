condition = this.actor.hasCondition("blinded");
if (condition)
{
    await condition.delete();
    this.script.notification("Removed Blinded");
}

let condition = this.actor.hasCondition("bleeding");
if (condition)
{
    await condition.delete();
    this.script.notification("Removed Bleeding");
}

condition = this.actor.hasCondition("poisoned");
if (condition)
{
    await condition.delete();
    this.script.notification("Removed Poisoned");
}
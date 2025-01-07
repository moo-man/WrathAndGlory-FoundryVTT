let condition = this.actor.hasCondition("blinded");

if (condition)
{
    await condition.delete();
    this.script.notification("Removed Blinded");
}

condition = this.actor.hasCondition("fear");

if (condition)
{
    await condition.delete();
    this.script.notification("Removed Fear");
}

condition = this.actor.hasCondition("poisoned");

if (condition)
{
    await condition.delete();
    this.script.notification("Removed Poisoned");
}

condition = this.actor.hasCondition("terror");

if (condition)
{
    await condition.delete();
    this.script.notification("Removed Terror");
}
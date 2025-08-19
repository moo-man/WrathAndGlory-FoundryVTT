let condition = this.actor.hasCondition("bleeding");
if (condition)
{
    await condition.delete();
    this.script.notification("Immune to Bleeding");
}

condition = this.actor.hasCondition("blinded");
if (condition)
{
    await condition.delete();
    this.script.notification("Immune to Blinded");
}

condition = this.actor.hasCondition("exhausted");
if (condition)
{
    await condition.delete();
    this.script.notification("Immune to Exhausted");
}

condition = this.actor.hasCondition("fear");
if (condition)
{
    await condition.delete();
    this.script.notification("Immune to Fear");
}

condition = this.actor.hasCondition("pinned");
if (condition)
{
    await condition.delete();
    this.script.notification("Immune to Pinned");
}

condition = this.actor.hasCondition("poisoned");
if (condition)
{
    await condition.delete();
    this.script.notification("Immune to Poisoned");
}

condition = this.actor.hasCondition("terror");
if (condition)
{
    await condition.delete();
    this.script.notification("Immune to Terror");
}
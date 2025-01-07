let condition = this.actor.hasCondition("bleeding");

if (condition)
{
    await condition.delete();
    this.script.notification("Removed Bleeding");
}

condition = this.actor.hasCondition("exhausted");

if (condition)
{
    await condition.delete();
    this.script.notification("Removed Exhausted");
}

condition = this.actor.hasCondition("poisoned");

if (condition)
{
    await condition.delete();
    this.script.notification("Removed Poisoned");
}

condition = this.actor.hasCondition("prone");

if (condition)
{
    await condition.delete();
    this.script.notification("Removed Prone");
}
if (args.test.weapon?.isRanged)
{
    args.modifiers.resilience.push({value : 1, label : this.effect.name})
    args.resilience.invulnerable = true;
}
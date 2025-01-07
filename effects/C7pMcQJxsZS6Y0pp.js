if (args.test.weapon?.isRanged)
{
    args.modifiers.resilience.push({value : 1, label : this.effect.label})
    args.resilience.invulnerable = true;
}
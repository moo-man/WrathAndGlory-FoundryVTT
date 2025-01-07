if (args.test.result.isWrathCritical)
{
  args.modifiers.mortal.push({label: this.effect.name, value: 1});
}

let report = await this.actor.applyDamage(0, {mortal: 1});
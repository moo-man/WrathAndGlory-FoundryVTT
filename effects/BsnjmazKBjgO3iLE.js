if (args.test?.item?.type == "weapon")
{
  let damage = args.test.item.system.damage.base + args.test.item.system.damage.bonus;
  if (await this.script.dialog(`Reduce Damage rating to 0? (-${damage})`))
  {
    args.modifiers.damage.push({label : this.effect.name, value : -damage});
  }
}
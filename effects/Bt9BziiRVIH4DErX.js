let weapon = args.test?.weapon;
if (weapon && weapon.system.damage.base < 14)
{
  args.resilience.invulnerable = true;
}
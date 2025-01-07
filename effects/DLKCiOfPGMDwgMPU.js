for(let skill in args.system.skills)
{
  if (args.system.skills[skill].total < 3)
    args.system.skills[skill].total = 3;
}
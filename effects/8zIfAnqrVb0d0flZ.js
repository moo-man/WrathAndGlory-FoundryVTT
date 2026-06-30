if (args.test?.power && (args.wounds || args.shock))
{
  let rating = 3;
  if (args.test.power.traitList.inflict)
  {
    rating = (parseInt(args.test.power.traitList.inflict.rating.replace("Poisoned", "")) || 2) + 1; 
  }
  await args.actor.addCondition("poisoned", {[game.system.id] : {value : rating}});
}
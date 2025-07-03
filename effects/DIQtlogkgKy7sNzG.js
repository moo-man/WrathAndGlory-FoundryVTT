if(args.context.fear || args.context.resolve)
{
	return false
}
return args.weapon || args.power || !["willpower", "intellect", "fellowship"].includes(args.attribute)
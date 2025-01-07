if(args.options.fear || args.options.resolve)
{
	return false
}
return args.weapon || args.power || !["willpower", "intellect", "fellowship"].includes(args.attribute)
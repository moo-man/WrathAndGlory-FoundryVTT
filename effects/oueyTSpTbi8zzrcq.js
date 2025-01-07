let item = args.test?.item;

if (item && item.hasKeyword(["MELTA", "FIRE"]))
{
	args.abort = this.effect.name;
}
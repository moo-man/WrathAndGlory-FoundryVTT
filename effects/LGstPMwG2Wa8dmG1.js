if (args.context.resolve)
{
	this.script.notification("Does not makes Resolve Tests");
	args.abort = true;
}
else return true;
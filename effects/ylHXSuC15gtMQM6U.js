if (args.context.conviction || args.context.resolve)
{
	args.abort = true;
	this.script.notification("Automatically succeed Resolve or Conviction Tests")
}
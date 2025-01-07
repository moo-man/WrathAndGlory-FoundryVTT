if (args.options.conviction || args.options.resolve)
{
	args.abort = true;
	this.script.notification("Automatically succeed Resolve or Conviction Tests")
}
if (args.context.resolve)
{
  this.script.notification("Automatically pass Resolve Tests");
  args.abort = true;
}
return true;
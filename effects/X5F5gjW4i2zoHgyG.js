if (args.options.resolve)
{
    args.abort = true;
    this.script.notification("Does not need to make Resolve Tests");
}
else return true
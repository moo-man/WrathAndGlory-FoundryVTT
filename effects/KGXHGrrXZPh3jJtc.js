if (args.fields.range == "long")
{
  args.abort = true;
  this.script.error("Cannot fire at Long Range!");
}

return true;
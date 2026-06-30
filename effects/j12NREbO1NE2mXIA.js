if (args.type == "effect" && args.options.action == "create" && args.document.isCondition)
{
  args.document.updateSource({"disabled" : true});
}

if (args.type == "effect" && args.options.action == "update" && args.document.isCondition)
{
  if (args.data.disabled == false)
  {
    this.script.notification("Cannot enable Conditions");
    return false;
  }
}
if (args.ap > 3)
{
  this.script.notification("Damaged! Re-enable effect when repaired.")
  this.effect.update({"disabled" : true});
}
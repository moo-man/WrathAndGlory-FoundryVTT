let augmetics = this.actor.itemTypes.augmentic.length;

let wounds = args.wounds + args.mortal;
if (wounds <= augmetics)
{
  args.abort = await this.script.dialog(`Ignore ${wounds} Wounds? (Once per session)`);
  if (args.abort)
  {
    args.abort = this.effect.name;
    this.effect.update({"disabled" : true});
    this.script.notification("Disabled");
  }
}
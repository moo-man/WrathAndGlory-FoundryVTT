if (args.result.isWrathComplication)
{ 
  let report = await this.actor.applyDamage(0, {mortal: 1});
  this.script.message(`Received ${report.wounds} Wounds and ${report.shock} Shock</span>`)
}
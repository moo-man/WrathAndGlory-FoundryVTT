this.actor.addCondition("hindered", {[game.system.id] : {value : 2}})

if (this.effect.sourceTest.result.blind)
{
  this.actor.addCondition("blinded");
}
if (this.effect.sourceTest.result.fear)
{
  this.actor.setupGenericTest("fear", {dn: 3, appendTitle: ` - ${this.effect.name}`})

}
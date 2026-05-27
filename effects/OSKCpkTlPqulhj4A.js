this.actor.removeCondition("hindered");

if (this.effect.sourceTest.result.blind)
{
  this.actor.removeCondition("blinded");
}
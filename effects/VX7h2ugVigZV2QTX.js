let myLeadership = this.actor.system.skills.leadership.total;
let sourceLeadership = this.effect.sourceActor.skills.leadership.total;

if ( myLeadership < sourceLeadership )
{
  this.actor.system.skills.leadership.total = sourceLeadership;
}

this.script.notification(`Changed ${this.actor.name} Leadership to 12`);
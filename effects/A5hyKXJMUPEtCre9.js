let myConviction = this.actor.system.combat.conviction.total;
let shaperConviction  = this.effect.sourceActor.system.combat.conviction.total
if ( myConviction  < shaperConviction )
{
  this.actor.system.combat.conviction.total = shaperConviction;
}

let myResolve = this.actor.system.combat.resolve.total;
let shaperResolve  = this.effect.sourceActor.system.combat.resolve.total
if ( myResolve < shaperResolve  )
{
  this.actor.system.combat.resolve.total = shaperResolve;
}
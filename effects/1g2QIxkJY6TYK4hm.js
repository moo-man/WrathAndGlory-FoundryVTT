if (this.actor.uuid != this.effect.sourceActor.uuid)
{
    this.actor.update({
      system: {
        combat : {
          shock: {
            value: this.actor.system.combat.shock.value + 2
          }
        },
        corruption: {
          current: this.actor.system.corruption?.current + 1
        }
      }
    });
    this.script.message("Gained 2 Shock and 1 Corruption");
  this.actor.setupGenericTest("fear", {fields : {difficulty : 3}});

}
let roll = await new Roll(`1d6 + 3 + ${this.effect.sourceTest.result.shock}`).roll();
if (this.actor.uuid != this.effect.sourceActor.uuid)
{
    this.actor.update({
      system: {
        combat : {
          shock: {
            value: this.actor.system.combat.shock.value + roll.total
          }
        },
        corruption: {
          current: this.actor.system.corruption?.current + this.effect.sourceTest.result.corruption
        }
      }
    });
    roll.toMessage(this.script.getChatData());
    this.script.message(`Gained ${roll.total} Shock and ${this.effect.sourceTest.result.corruption} Corruption`);
}
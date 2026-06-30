WnGTables.rollTable("perils", null, {modifier: this.effect.sourceTest.result.modifier});
this.actor.update({"system.corruption.current" : this.actor.system.corruption.current + this.effect.sourceTest.result.corruption});
this.script.notification(`Added +${this.effect.sourceTest.result.corruption} Corruption`);
this.effect.update({"system.changes" : [{key: "system.combat.speed", mode: "add", value: this.actor.advances.rank}]});
game.counter.change(1, "ruin");
this.script.message("Gained 1 Ruin");
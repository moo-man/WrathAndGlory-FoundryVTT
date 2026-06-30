this.actor.update({
    system: {
      corruption: {
        current: this.actor.system.corruption?.current + 1
      }
    }
  });
  this.script.message("Gained 1 Corruption");
this.actor.setupGenericTest("fear", {fields : {difficulty : 3}});
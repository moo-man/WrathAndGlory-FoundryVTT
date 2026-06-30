let effects = this.effect.getFlag(game.system.id, "ids");
  if (effects?.length)
  {
    effects.forEach(id => {
      foundry.utils.fromUuidSync(id)?.update({"disabled": false});
    })
  }
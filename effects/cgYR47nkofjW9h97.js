let abilities = [];
for(let ability of this.actor.system.archetype?.document?.system.abilities.list.map(i => i.name))
{
  let found = this.actor.itemTypes.ability.find(i => i.name == ability);
  if (found) abilities.push(found);
}

if (abilities.length)
{
  let effects = abilities.reduce((e, abilities) => e.concat(abilities.effects.contents), []);
  if (effects.length)
  { 
    this.script.notification(`Disabling ${effects.map(i => i.name).join(", ")}`);
    effects.forEach(e => e.update({disabled: true}));
    this.effect.updateSource({"flags.wrath-and-glory.ids" : effects.map(i => i.uuid)});
  }
}
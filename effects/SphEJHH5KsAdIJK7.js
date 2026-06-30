let conditions = this.actor.effects.contents.filter(e => e.isCondition);

let update = conditions.map(e => {return {_id : e.id, disabled: false}});

this.actor.updateEmbeddedDocuments("ActiveEffect", update);

this.script.message(`Enabling ${conditions.map(i => i.name).join(", ")}`);
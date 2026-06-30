let conditions = this.actor.effects.filter(e => e.isCondition);

this.actor.deleteEmbeddedDocuments("ActiveEffect", conditions.map(i => i.id));
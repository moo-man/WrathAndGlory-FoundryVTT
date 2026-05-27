this.actor.effects.find(e => e.statuses.has("halfCover"))?.update({disabled: true});
this.actor.effects.find(e => e.statuses.has("fullCover"))?.update({disabled: true});
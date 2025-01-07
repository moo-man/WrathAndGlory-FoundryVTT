await this.actor.update({"system.combat.wounds.value" : this.actor.system.combat.wounds.value + this.actor.system.advances.tier})

this.item.effects.getName("Flagellated").update({disabled: false})

this.script.message(`Self-inflicted ${this.actor.system.advances.tier} Wounds`)
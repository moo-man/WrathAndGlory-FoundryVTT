await this.actor.update({"system.combat.wounds.value" : this.actor.system.combat.wounds.value + this.actor.system.advances.tier})

await this.item.effects.getName("Flagellated").update({disabled: false})
await this.effect.update({"disabled" : true})

this.script.message(`Self-inflicted ${this.actor.system.advances.tier} Wounds`)
export default function() {
    Hooks.on("updateActor", (actor, data, options, userId) => {
        if (userId == game.user.id)
        {
            if (actor.combat.wounds.value && actor.getFlag("wrath-and-glory", "autoWounded"))
            {
                if (!actor.hasCondition("wounded"))
                    actor.addCondition("wounded")
            }
            else if (actor.hasCondition("wounded") && actor.getFlag("wrath-and-glory", "autoWounded"))
                actor.removeCondition("wounded")
    
    
            if (actor.combat.shock.value > actor.combat.shock.max && actor.getFlag("wrath-and-glory", "autoExhausted"))
            {
                if (!actor.hasCondition("exhausted"))
                    actor.addCondition("exhausted", {"wrath-and-glory.auto" : true}) // Auto flag for auto deletion
            }
            else if (actor.hasCondition("exhausted") && actor.getFlag("wrath-and-glory", "autoExhausted")) // If not auto added, don't auto delete
            {
                if (actor.hasCondition("exhausted").getFlag("wrath-and-glory", "auto"))
                    actor.removeCondition("exhausted")
            }
        }
    })
}
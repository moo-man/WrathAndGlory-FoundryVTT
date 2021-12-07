export default function() {
    Hooks.on("updateActor", (actor, data) => {
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
                actor.addCondition("exhausted")
        }
        else if (actor.hasCondition("exhausted") && actor.getFlag("wrath-and-glory", "autoExhausted"))
            actor.removeCondition("exhausted")

    })
}
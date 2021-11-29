export default function() {
    Hooks.on("updateActor", (actor, data) => {
        if (actor.combat.wounds.value && actor.getFlag("wrath-and-glory", "autoWounded"))
        {
            if (!actor.hasCondition("wounded"))
                actor.addCondition("wounded")
        }
        else if (actor.hasCondition("wounded") && actor.getFlag("wrath-and-glory", "autoWounded"))
            actor.removeCondition("wounded")

    })
}
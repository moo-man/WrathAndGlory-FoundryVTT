export default function() {
    Hooks.on("preCreateActiveEffect", (effect, data, options, user) => {
        if (["psychicPower","weaponUpgrade","weapon","ammo","faction"].includes(effect.parent?.type)) // Default effects to not transfer to actor for these item types
            effect.data.update({"transfer" : false})
    })
}
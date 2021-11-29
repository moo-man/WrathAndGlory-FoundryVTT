export default function() {
    Hooks.on("preCreateActiveEffect", (effect, data, options, user) => {
        if (effect.parent?.type == "psychicPower" || effect.parent?.type == "weaponUpgrade" || effect.parent?.type == "weapon" || effect.parent?.type == "ammo")
            effect.data.update({"transfer" : false})
    })
}
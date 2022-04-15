export default function() {
    Hooks.on("preCreateItem", (item, options, userId) => {
        if (["species", "archetype", "faction"].includes(item.type) && item.isOwned)
        {

            // If actor already owns species, archetype, or faction, replace it
            if (item.parent[item.type])
            {
                item.parent[item.type].update(item.toObject())
                return false
            }
        }
    })
}
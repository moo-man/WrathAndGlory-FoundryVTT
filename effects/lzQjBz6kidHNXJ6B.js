if (args.item.system.isEquipped)
{
    if (args.item.system.traits.list.find(i => i.name == "heavy"))
    {
        args.item.system.traits.list.push({name : "brutal"})
    }
}
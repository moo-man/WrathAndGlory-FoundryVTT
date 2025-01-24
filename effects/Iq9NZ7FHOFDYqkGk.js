if (args.item.system.isEquipped && args.item.type == "weapon")
{
    if (args.item._source.system.traits.list.find(i => i.name == "parry"))
    { 
        args.item.flags.hasParry= true;
    }
    else if (args.item.hasKeyword("BLADE"))
    {
        args.item.system.traits.list.push({name : "parry"})
    }
}
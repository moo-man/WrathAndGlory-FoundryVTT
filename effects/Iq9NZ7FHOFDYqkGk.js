if (args.item.system.isEquipped && args.item.type == "weapon" && args.item.hasKeyword("BLADE"))
{
if (args.item._source.system.traits.list.find(i => i.name == "parry"))
{ 
    args.item.flags.hasParry= true;
}
else
{
    args.item.system.traits.list.push({name : "parry"})
}


}
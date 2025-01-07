if (args.item.system.isEquipped)
{
if (args.item._source.system.traits.list.find(i => i.name == "brutal"))
{ 
    args.item.flags.hasBrutal = true;
}
else
{
    args.item.system.traits.list.push({name : "brutal"})
}


}
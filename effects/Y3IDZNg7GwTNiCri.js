if (args.item.system.isEquipped && args.item.type == "weapon")
    {
        let sourceHeavy = args.item._source.system.traits.list.find(i => i.name == "heavy")
        let heavy = args.item.system.traits.list.find(i => i.name == "heavy");
        if (sourceHeavy && !heavy.tough)
        { 
            heavy.rating = Math.floor(parseInt(heavy.rating) / 2);
            heavy.tough = true;
        }
    }
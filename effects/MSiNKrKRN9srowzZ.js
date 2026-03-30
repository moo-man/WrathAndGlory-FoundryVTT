if (args.item.system.isEquipped && args.item.type == "weapon" && args.item.hasKeyword("BOLT"))
    {
        let existing = args.item.system.traits.list.find(i => i.name == "rapidFire");
        if (existing)
        { 
            existing.rating = Number(existing.rating) + this.actor.system.advances.rank;
        }
        else
        {
            args.item.system.traits.list.push({name : "rapidFire", rating: 2});
        }
    }
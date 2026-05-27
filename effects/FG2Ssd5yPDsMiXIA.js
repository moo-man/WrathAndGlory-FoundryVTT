if (args.item.system.isEquipped && args.item.type == "weapon" && args.item.hasKeyword("AELDARI", "DRUKHARI"))
    {
        let existing = args.item.system.traits.list.find(i => i.name == "rending");
        if (existing)
        { 
            existing.rating = Number(existing.rating) + this.actor.system.advances.rank;
        }
        else
        {
            args.item.system.traits.list.push({name : "rending", rating: this.actor.system.advances.rank});
        }
    }
if (args.item.system.isEquipped && args.item.type == "weapon")
    {
        let sourceBlast = args.item._source.system.traits.list.find(i => i.name == "blast")
        let blast = args.item.system.traits.list.find(i => i.name == "blast");
        if (sourceBlast && !blast.bombadier)
        { 
            blast.rating = parseInt(blast.rating) +  (this.actor.system.advances.rank * 2);
            blast.bombadier = true;
        }
    }
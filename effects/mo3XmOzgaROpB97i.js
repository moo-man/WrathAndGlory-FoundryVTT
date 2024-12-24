let choice = await ItemDialog.create(ItemDialog.objectToArray(systemConfig().weaponTraits, this.item.img), 1, {title : this.effect.name})
if (choice[0])
{
    let trait = choice[0];
    let traitData = {
        name : trait.id,
    }
    if (systemConfig().traitHasRating[trait.id])
    {
        let roll = Math.ceil(CONFIG.Dice.randomUniform() * 3)
        this.script.message('Rolled ' + roll + ' for ' + systemConfig().weaponTraits[trait.id], {flavor : this.effect.name});
        traitData.rating = roll;
    }

    this.item.update({'system.traits.list' : this.item.system.traits.list.filter(i => i.name != 'kustom').concat(traitData)})
}
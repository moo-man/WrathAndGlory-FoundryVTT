let chosen = await ItemDialog.create(ItemDialog.objectToArray(game.wng.config.weaponTraits, this.effect.img).filter(i => !this.item.system.traits.has(i.id)), 1, {title: this.effect.name, text: "Choose Trait to add"});

if (chosen.length)
{
    let rating;
    this.script.message("Chose " + chosen[0].name);
    if (game.wng.config.traitHasRating[chosen[0].id])
    {
        let roll = await new Roll("1d3").roll();
        roll.toMessage(this.script.getChatData({flavor: chosen[0].name}));
        rating = roll.total;
    }

    this.item.update({"system.traits.list" : this.item.system.traits.list.filter(i => i.name != "kustom").concat({name: chosen[0].id, rating})});
}
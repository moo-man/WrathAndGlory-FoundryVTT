let existing = this.actor.items.getName(this.item.name);
let effects;
if (existing)
{
    effects = existing.effects.contents.filter(i => i.id != this.effect.id && i.system.transferData.type == "other");

    let choice = await ItemDialog.create(effects, 1, {title : this.effect.name, text: this.script.name});

    if (choice[0])
    {
        choice[0].update({"system.transferData.type" : "document"})
        await choice[0]._preCreate(args.data, args.options, args.user);
    }
  args.options.abortItemCreation = true;
}
else 
{
    effects = this.item.effects.contents.filter(i => i.id != this.effect.id);

    let choice = await ItemDialog.create(effects, 1, {title : this.effect.name, text: this.script.name});

    if (choice[0])
    {
        choice[0].updateSource({"system.transferData.type" : "document"})
        await choice[0]._preCreate(args.data, args.options, args.user);
    }
}
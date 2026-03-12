if (
    args.type == "item" && // Item update
    args.document.type === "ammo" && // Item is ammunition
    foundry.utils.getProperty(args.data, "system.quantity") < args.document.system.quantity && // Item quantity is decreasing
    args.document.parent.itemTypes.weapon.find(i => i.system.ammo?.id == args.document.id && i.hasKeyword(["LAS"])) // Item is ammunition for a las weapon
) 
{
    let roll = await new Roll("1dp").roll();

    roll.toMessage(this.script.getChatData());

    if (roll.total == 6)
    {
        this.script.notification("Ammo Preserved");
        return false;
    }
}
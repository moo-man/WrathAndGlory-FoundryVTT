if (
    args.document.type === "weapon" &&
    args.update?.["system.ammo.value"] !== undefined &&
    this.actor?.items.get(args.document.id)?.hasKeyword(["LAS"])
) {
    const item = this.actor.items.get(args.document.id);

    // Check if ammo is decreasing
    const current = item.system.ammo?.value ?? 0;
    const newVal = args.update["system.ammo.value"];
    
    if (newVal < current) {
        const roll = await new Roll("1d6x6").roll({ async: true });
        roll.toMessage({ flavor: "Old Reliable: Ammo Check (Wrath Die)" });

        const isExalted = roll.terms[0].results.some(r => r.result === 6);

        if (isExalted) {
            // Cancel the ammo update
            args.update["system.ammo.value"] = current;
            this.script.notification("Old Reliable: LAS Ammo Preserved on Exalted Icon");
        }
    }
}
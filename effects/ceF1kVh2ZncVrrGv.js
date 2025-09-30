await this.actor.addEffectItems(["Compendium.wng-core.items.Item.jJVaniinuX8Hjh08", "Compendium.wng-core.items.Item.aDPxxSPWTfKDgQDu"], this.effect);

let talents = await this.actor.system.archetype.document.system.suggested.talents.awaitDocuments();

let choice = await ItemDialog.create(talents, 1, { title: this.item.name, text: "Choose any 1 Talent from your Archetype's Suggested Talents without XP Cost" });

if (choice[0]) {
    let talent = choice[0].toObject();
    talent.system.cost = 0;
    this.actor.createEmbeddedDocuments("Item", [talent]);
}

return 
// I'm not convinced the wargear works well

let wargear = (await warhammer.utility.findAllItems("weapon", null, true, ["system.keywords", "system.rarity"]))
    .concat(await warhammer.utility.findAllItems("armour", null, true, ["system.keywords", "system.rarity"]))
    .concat(await warhammer.utility.findAllItems("gear", null, true, ["system.keywords", "system.rarity"]))
    .concat(await warhammer.utility.findAllItems("ammo", null, true, ["system.keywords", "system.rarity"]))
    .concat(await warhammer.utility.findAllItems("augmetic", null, true, ["system.keywords", "system.rarity"]))
    .concat(await warhammer.utility.findAllItems("weaponUpgrade", null, true, ["system.keywords", "system.rarity"]))

let rare = wargear.filter(i => ["rare"].includes(i.system.rarity)).filter(i => {
    let itemKeywords = i.system.keywords.split(",").map(i => i.trim().toUpperCase());
    return this.actor.itemTypes.keyword.filter(k => itemKeywords.includes(k.name.toUpperCase())).length >= 2
}
)

let vRare = wargear.filter(i => ["very-rare"].includes(i.system.rarity)).filter(i => {
    let itemKeywords = i.system.keywords.split(",").map(i => i.trim().toUpperCase());
    return this.actor.itemTypes.keyword.filter(k => itemKeywords.includes(k.name.toUpperCase())).length >= 3
}
)

if (rare.length + vRare.length)
{
    let choice = await ItemDialog.create(rare.concat(vRare), 1, {indexed: true, title: this.item.name, text: "Choose any 1 Rare Wargear you share 2 or more Keywords with, or any 1 Very Rare Wargear you share 3 or more Keywords with." });
    this.actor.createEmbeddedDocuments("Item", choice);
}
else 
{
    this.script.notification("Could not find any Items satisfying the condition: rare Wargear you share 2 or more Keywords with, or Very Rare Wargear you share 3 or more Keywords with", "error")
}
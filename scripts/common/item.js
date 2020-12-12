export class WrathAndGloryItem extends Item {
    static async create(data, options) {
        super.create(data, options);
    }

    async sendToChat() {
        const item = duplicate(this.data);
        if (item.img.includes("/unknown")) {
            item.img = null;
        }
        item.isKeyword = item.type === "keyword";
        item.isTalent = item.type === "talent";
        item.isAbility = item.type === "ability";
        item.isPsychicPower = item.type === "psychicPower";
        item.isArmour = item.type === "armour";
        item.isWeapon = item.type === "weapon";
        item.isWeaponUpgrade = item.type === "weaponUpgrade";
        item.isGear = item.type === "gear";
        item.isTraumaticInjury = item.type === "traumaticInjury";
        item.isMemorableInjury = item.type === "memorableInjury";
        item.isAscension = item.type === "ascension";
        item.isMutation = item.type === "mutation";
        item.isAmmo = item.type === "ammo";
        item.isAugmentic = item.type === "augmentic";
        const html = await renderTemplate("systems/wrath-and-glory/template/chat/item.html", item);
        const chatData = {
            user: game.user._id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperRecipients("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        ChatMessage.create(chatData);
    }
}
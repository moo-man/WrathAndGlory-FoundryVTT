export class WrathAndGloryItem extends Item {
    static async create(data, options) {
        super.create(data, options);
    }

    async sendToChat() {
        const item = new CONFIG.Item.documentClass(this.data._source)
        if (item.data.img.includes("/unknown")) {
            item.data.img = null;
        }

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


    get isKeyword() {return this.type === "keyword"}

    get isTalent() {return this.type === "talent"}

    get isAbility() {return this.type === "ability"}

    get isTalentOrAbility() {return this.isTalent || this.isAbility}

    get isPsychicPower() {return this.type === "psychicPower"}

    get isArmour() {return this.type === "armour"}

    get isWeapon() {return this.type === "weapon"}

    get isWeaponUpgrade() {return this.type === "weaponUpgrade"}

    get isGear() {return this.type === "gear"}

    get isTraumaticInjury() {return this.type === "traumaticInjury"}

    get isMemorableInjury() {return this.type === "memorableInjury"}

    get isAscension() {return this.type === "ascension"}

    get isMutation() {return this.type === "mutation"}

    get isAmmo() {return this.type === "ammo"}

    get isAugmentic() {return this.type === "augmentic"}

}
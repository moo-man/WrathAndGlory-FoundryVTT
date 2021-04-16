export class WrathAndGloryItem extends Item {
    static async create(data, options) {
        super.create(data, options);
    }

    async sendToChat() {
        const item = new CONFIG.Item.documentClass(this.data._source)
        if (item.data.img.includes("/unknown")) {
            item.data.img = null;
        }

        const html = await renderTemplate("systems/wrath-and-glory/template/chat/item.html", {item, data: item.data.data});
        const chatData = {
            user: game.user,
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

    _dataWithRank(type) {
        let data = this.data.data[type]
        let damage = data.base + data.bonus;
        let rank = "";
        if (data.rank === "single") {
            rank = " + R";
        } else if (data.rank === "double") {
            rank = " + DR";
        }
        return `${damage}${rank}`;
    }

    get range() {
        let data = this.data.data
        const short = data.range.short < 1 ? "-" : data.range.short;
        const medium = data.range.medium < 1 ? "-" : data.range.medium;
        const long = data.range.long < 1 ? "-" : data.range.long;
        const salvo = data.salvo < 1 ? "-" : data.salvo;
        return `${salvo} | ${short} / ${medium} / ${long}`;
    }

    get damage() {
        return this._dataWithRank("damage");
    }
    get ed() {
        return this._dataWithRank("ed");
    }
    get ap() {
        return this._dataWithRank("ap");
    }

    get activation() {
        switch (this.data.data.activation) {
            case "free":
                return game.i18n.localize("ACTIVATION.FREE");
            case "action":
                return game.i18n.localize("ACTIVATION.ACTION");
            case "simple":
                return game.i18n.localize("ACTIVATION.SIMPLE");
            case "full":
                return game.i18n.localize("ACTIVATION.FULL");
            case "movement":
                return game.i18n.localize("ACTIVATION.MOVEMENT");
            default:
                return game.i18n.localize("ACTIVATION.ACTION");
        }
    }
    get rarity() {
        switch (this.data.data.rarity) {
            case "common":
                return game.i18n.localize("RARITY.COMMON");
            case "uncommon":
                return game.i18n.localize("RARITY.UNCOMMON");
            case "rare":
                return game.i18n.localize("RARITY.RARE");
            case "very-rare":
                return game.i18n.localize("RARITY.VERY_RARE");
            case "unique":
                return game.i18n.localize("RARITY.UNIQUE");
            default:
                return game.i18n.localize("RARITY.COMMON");
        }
    }
    get category() {
        switch (this.data.data.category) {
            case "melee":
                return game.i18n.localize("CATEGORY.MELEE");
            case "ranged":
                return game.i18n.localize("CATEGORY.RANGED");
            default:
                return game.i18n.localize("CATEGORY.MELEE");
        }
    }

    get isKeyword() { return this.type === "keyword" }

    get isTalent() { return this.type === "talent" }

    get isAbility() { return this.type === "ability" }

    get isTalentOrAbility() { return this.isTalent || this.isAbility }

    get isPsychicPower() { return this.type === "psychicPower" }

    get isArmour() { return this.type === "armour" }

    get isWeapon() { return this.type === "weapon" }

    get isWeaponUpgrade() { return this.type === "weaponUpgrade" }

    get isGear() { return this.type === "gear" }

    get isTraumaticInjury() { return this.type === "traumaticInjury" }

    get isMemorableInjury() { return this.type === "memorableInjury" }

    get isAscension() { return this.type === "ascension" }

    get isMutation() { return this.type === "mutation" }

    get isAmmo() { return this.type === "ammo" }

    get isAugmentic() { return this.type === "augmentic" }

}
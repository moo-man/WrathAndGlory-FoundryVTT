export class WrathAndGloryItem extends Item {


    _preUpdate(updateData, options, user)
    {
        if (hasProperty(updateData, "data.quantity") && updateData.data.quantity < 0)
            updateData.data.quantity = 0;
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
        let data = this[type]
        let damage = data.base + data.bonus;
        let rank = "";
        if (data.rank === "single") {
            rank = " + R";
        } else if (data.rank === "double") {
            rank = " + DR";
        }
        return `${damage}${rank}`;
    }

    // @@@@@@ FORMATTED GETTERs @@@@@@
    get Range() {
        const short = this.range.short < 1 ? "-" : this.range.short;
        const medium = this.range.medium < 1 ? "-" : this.range.medium;
        const long = this.range.long < 1 ? "-" : this.range.long;
        const salvo = this.salvo < 1 ? "-" : this.salvo;
        return `${salvo} | ${short} / ${medium} / ${long}`;
    }

    get Damage() {
        return this._dataWithRank("damage");
    }
    get ED() {
        return this._dataWithRank("ed");
    }
    get AP() {
        return this._dataWithRank("ap");
    }

    get Activation() {
        switch (this.activation) {
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
    get Rarity() {
        switch (this.rarity) {
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
    get Category() {
        switch (this.category) {
            case "melee":
                return game.i18n.localize("CATEGORY.MELEE");
            case "ranged":
                return game.i18n.localize("CATEGORY.RANGED");
            default:
                return game.i18n.localize("CATEGORY.MELEE");
        }
    }

    get MultiTarget() {
        return this.multiTarget ? game.i18n.localize("Yes") : game.i18n.localize("No")
    }

    get isMelee() {
        return this.category == "melee"
    }

    get isRanged() {
        return this.category == "ranged"
    }


    // @@@@@@ TYPE GETTERS @@@@@@
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

    // @@@@@@ DATA GETTERS @@@@@@
    get ammo() { return this.data.data.ammo }
    get bonus() { return this.data.data.bonus }
    get effect() { return this.data.data.effect }
    get cost() { return this.data.data.cost }
    get requirements() { return this.data.data.requirements }
    get description() { return this.data.data.description }
    get display() { return this.data.data.display }
    get value() { return this.data.data.value }
    get rarity() { return this.data.data.rarity }
    get keywords() { return this.data.data.keywords }
    get quantity() { return this.data.data.quantity }
    get rating() { return this.data.data.rating }
    get traits() { return this.data.data.traits }
    get influence() { return this.data.data.influence }
    get benefits() { return this.data.data.benefits }
    get dn() { return this.data.data.dn }
    get activation() { return this.data.data.activation }
    get duration() { return this.data.data.duration }
    get range() { return this.data.data.range }
    get multiTarget() { return this.data.data.multiTarget }
    get prerequisites() { return this.data.data.prerequisites }
    get potency() { return this.data.data.potency }
    get damage() { return this.data.data.damage }
    get ed() { return this.data.data.ed }
    get attack() { return this.data.data.attack }
    get ap() { return this.data.data.ap }
    get category() { return this.data.data.category }
    get salvo() { return this.data.data.salvo }
    get upgrades() { return this.data.data.upgrades }
    get equipped() { return this.data.data.equipped }
}
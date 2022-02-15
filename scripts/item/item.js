import WNGUtility from "../common/utility.js";

export class WrathAndGloryItem extends Item {

    // Upon creation, assign a blank image if item is new (not duplicated) instead of mystery-man default
    async _preCreate(data, options, user) {
        if (data._id && !this.isOwned)
            options.keepId = WNGUtility._keepID(data._id, this)

        await super._preCreate(data, options, user)
    }

    _preUpdate(updateData, options, user) {
        if (hasProperty(updateData, "data.quantity") && updateData.data.quantity < 0)
            updateData.data.quantity = 0;
        if (getProperty(updateData, "data.test.type") == "corruption")
            setProperty(updateData, "data.test.specification", "corruption")
    }

    prepareData() {
        super.prepareData()
        if (this.type == "weapon")
            this.applyUpgrades();
    }

    prepareOwnedData() {
        let functionName = `prepareOwned${this.type[0].toUpperCase() + this.type.slice(1)}`

        if (this[functionName])
            this[functionName]()
    }


    prepareOwnedWeapon() {
        if (this.isRanged && this.category == "launcher" && this.Ammo) {
            this.data.data.damage = this.Ammo.damage
            this.data.data.ap = this.Ammo.ap
            this.data.data.ed = this.Ammo.ed
        }
        if (this.isRanged && this.Ammo) {
            this.applyAmmo()
        }
    }

    async sendToChat() {
        const item = new CONFIG.Item.documentClass(this.data._source)
        if (item.data.img.includes("/unknown")) {
            item.data.img = null;
        }

        const html = await renderTemplate("systems/wrath-and-glory/template/chat/item.html", { item, data: item.data.data });
        const chatData = {
            user: game.user.id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            "flags.wrath-and-glory.itemData": this.toObject()
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


    _dropdownData() {
        return { text: this.description }
    }


    applyUpgrades() {
        this._applyEffects(this.Upgrades.reduce((effects, upgrade) => {
            return effects.concat(Array.from(upgrade.effects))
        }, []))

        this._addTraits(this.Upgrades.reduce((traits, upgrade) => {
            return traits.concat(upgrade.traits)
        }, []))
    }

    applyAmmo() {
        this._applyEffects(this.Ammo.effects)
        this._addTraits(this.Ammo.traits)
    }


    _applyEffects(effects) {
        let overrides = {}
        // Organize non-disabled effects by their application priority
        const changes = effects.reduce((changes, e) => {
            if (e.data.disabled) return changes;
            return changes.concat(e.data.changes.map(c => {
                c = foundry.utils.duplicate(c);
                c.effect = e;
                c.priority = c.priority ?? (c.mode * 10);
                return c;
            }));
        }, []);
        changes.sort((a, b) => a.priority - b.priority);

        // Apply all changes
        for (let change of changes) {
            const result = change.effect.apply(this, change);
            if (result !== null) overrides[change.key] = result;
        }

    }


    _addTraits(traits) {
        let add = traits.filter(i => i.type == "add")
        let remove = traits.filter(i => i.type == "remove")

        add.forEach(trait => {
            let existing = this.data.data.traits.find(i => i.name == trait.name)
            if (!existing)
                this.data.data.traits.push(trait)
            else if (existing && Number.isNumeric(trait.rating))
                existing.rating = parseInt(existing.rating) + parseInt(trait.rating)
        })

        remove.forEach(trait => {
            let existing = this.data.data.traits.find(i => i.name == trait.name)
            let existingIndex = this.data.data.traits.findIndex(i => i.name == trait.name)
            if (existing) {
                if (trait.rating && Number.isNumeric(trait.rating)) {
                    existing.rating = parseInt(existing.rating) - parseInt(trait.rating)
                    if (existing.rating <= 0)
                        this.data.data.traits.splice(existingIndex, 1)
                }
                else {
                    this.data.data.traits.splice(existingIndex, 1)
                }
            }
        })

    }

    async addCondition(effect) {
        if (typeof (effect) === "string")
            effect = duplicate(CONFIG.statusEffects.find(e => e.id == effect))
        if (!effect)
            return "No Effect Found"

        if (!effect.id)
            return "Conditions require an id field"


        let existing = this.hasCondition(effect.id)

        if (!existing) {
            effect.label = game.i18n.localize(effect.label)
            effect["flags.core.statusId"] = effect.id;
            delete effect.id
            return this.createEmbeddedDocuments("ActiveEffect", [effect])
        }
    }

    async removeCondition(effect, value = 1) {
        if (typeof (effect) === "string")
            effect = duplicate(CONFIG.statusEffects.find(e => e.id == effect))
        if (!effect)
            return "No Effect Found"

        if (!effect.id)
            return "Conditions require an id field"

        let existing = this.hasCondition(effect.id)

        if (existing) {
            return existing.delete()
        }
    }


    hasCondition(conditionKey) {
        let existing = this.effects.find(i => i.getFlag("core", "statusId") == conditionKey)
        return existing
    }

    // @@@@@@ FORMATTED GETTERs @@@@@@
    get Range() {
        if (this.isRanged) {
            if (this.category == "launcher" || this.category == "grenade-missile") {
                return this.range.thrown * this.actor.attributes.strength.total
            }
            else {
                const short = this.range.short < 1 ? "-" : this.range.short;
                const medium = this.range.medium < 1 ? "-" : this.range.medium;
                const long = this.range.long < 1 ? "-" : this.range.long;
                const salvo = this.salvo < 1 ? "-" : this.salvo;
                return `${salvo} | ${short} / ${medium} / ${long}`;
            }
        }
        else if (this.isMelee) {
            return this.range.melee
        }
    }

    get Damage() {
        let damage = Number(this._dataWithRank("damage"));
        if (this.isMelee && this.isOwned)
            damage += this.actor.attributes.strength.total
        return damage
    }
    get ED() {
        return this._dataWithRank("ed");
    }
    get AP() {
        return this._dataWithRank("ap");
    }

    get Activation() {
        return game.wng.config.powerActivations[this.activation]
    }
    get Rarity() {
        return game.wng.config.rarity[this.rarity]
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
        return this.category == "ranged" || this.category == "launcher" || this.category == "grenade-missile"
    }

    get Traits() {
        return Object.values(this.traitList).map(i => i.display)
    }

    get TraitsAdd() {
        return Object.values(this.traitList).filter(i => i.type == "add").map(i => i.display)
    }


    get TraitsRemove() {
        return Object.values(this.traitList).filter(i => i.type == "remove").map(i => i.display)
    }

    get traitList() {
        let traits = {}
        this.data.data.traits.forEach(i => {

            if (i.custom) 
            {
                traits[i.name] = duplicate(i)
            }
            else 
            {
                traits[i.name] = {
                    name: i.name,
                    display: this.traitsAvailable[i.name],
                    type: i.type
                }
                if (game.wng.config.traitHasRating[i.name]) {
                    traits[i.name].rating = i.rating;
                    traits[i.name].display += ` (${i.rating})`
                }
            }
        })
        return traits
    }

    get Upgrades() {
        return this.upgrades.map(i => new CONFIG.Item.documentClass(i))
    }

    get traitsAvailable() {
        if (this.type == "weapon" || this.type == "weaponUpgrade" || this.type == "ability" || this.type == "ammo")
            return game.wng.config.weaponTraits
        else if (this.type == "armour")
            return game.wng.config.armourTraits
    }


    get skill() {
        if (this.isOwned) {
            if (this.type == "psychicPower")
                return this.actor.skills.psychicMastery
            else if (this.isMelee)
                return this.actor.skills.weaponSkill
            else
                return this.actor.skills.ballisticSkill
        }
        else {
            if (this.type == "psychicPower")
                return "psychicMastery"
            else if (this.isMelee)
                return "weaponSkill"
            else
                return "ballisticSkill"
        }
    }

    get ammoList() {
        if (!this.isOwned)
            return
        if (this.category == "ranged")
            return this.actor.getItemTypes("ammo")
        else if (this.category == "launcher")
            return this.actor.getItemTypes("weapon").filter(i => i.category == "grenade-missile")
        else if (this.category == "grenade-missile")
            return [this]

    }

    get Ammo() {
        if (this.isOwned)
            return this.actor.items.get(this.ammo)
    }

    // effects that exist on ammo type items that do not apply to the weapon
    get ammoEffects() {
        if (this.type == "ammo") {
            let effects = this.effects.filter(e => {
                if (e.data.disabled) return false;
                if (!e.data.changes.length)
                    return true
                return e.data.changes.some(c => {
                    return !hasProperty({ data: game.system.model.Item.weapon }, c.key) // Any effect that references a property that doesn't exist on the item, and isn't a dialog effect
                })
            })
            return effects
        }
        else
            return []
    }

    get ammoDialogEffects() {
        if (this.type == "ammo") {
            let effects = this.effects.filter(e => {
                if (e.data.disabled) return false;
                if (!e.data.changes.length)
                    return false
                return e.data.changes.some(c => {
                    return c.mode == 6
                })
            })
            return effects
        }
        else
            return []
    }

    get AbilityType() {
        return game.wng.config.abilityTypes[this.abilityType]
    }

    get rollable() {
        if (this.type == "ability") {
            if (this.abilityType == "determination") return true
            if (this.hasDamage) return true
            if (this.hasTest) return true
        }

    }

    get hasDamage() {
        return (this.damage && (this.damage.base || this.damage.bonus || this.damage.rank != "none")) || (this.ed && (this.ed.base || this.ed.bonus || this.ed.rank != "none"))
    }

    get damageValues() {
        if (this.traitList.brutal)
            return {
                1: 0,
                2: 0,
                3: 1,
                4: 1,
                5: 2,
                6: 2
            }
        else
            return {
                1: 0,
                2: 0,
                3: 0,
                4: 1,
                5: 1,
                6: 2
            }
    }

    get hasTest() {
        return this.test && Number.isNumeric(this.test.dn) && this.test.type
    }

    get DN() {
        if (!this.dn)
            return "?"
        if (Number.isNumeric(this.dn))
            return parseInt(this.dn)
        else if (this.dn.includes("@") && game.user.targets.size)
        {
            let target = Array.from(game.user.targets)[0]
            return eval(Roll.replaceFormulaData(this.dn, target.actor.getRollData()))
        }
        else return "?"
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
    get otherDamage() { return this.data.data.otherDamage }
    get ed() { return this.data.data.ed }
    get attack() { return this.data.data.attack }
    get ap() { return this.data.data.ap }
    get category() { return this.data.data.category }
    get salvo() { return this.data.data.salvo }
    get upgrades() { return this.data.data.upgrades || []}
    get equipped() { return this.data.data.equipped }
    get test() { return this.data.data.test }
    get abilityType() { return this.data.data.abilityType }


  /**
   * Transform the Document data to be stored in a Compendium pack.
   * Remove any features of the data which are world-specific.
   * This function is asynchronous in case any complex operations are required prior to exporting.
   * @param {CompendiumCollection} [pack]   A specific pack being exported to
   * @return {object}                       A data object of cleaned data suitable for compendium import
   * @memberof ClientDocumentMixin#
   * @override - Retain ID
   */
  toCompendium(pack) {
    let data = super.toCompendium(pack)
    data._id = this.id; // Replace deleted ID so it is preserved
    return data;
  }
}
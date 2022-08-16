import WNGUtility from "../common/utility.js";

export class WrathAndGloryItem extends Item {

    constructor(data, context)
    {
        super(data, context)
        if (context && context.archetype)
        {
            this.archetype = context.archetype.item;
            this.archetypeItemIndex = context.archetype.index;
            this.archetypeItemPath = context.archetype.path
        }
    }

    // Upon creation, assign a blank image if item is new (not duplicated) instead of mystery-man default
    async _preCreate(data, options, user) {
        if (data._id && !this.isOwned)
            options.keepId = WNGUtility._keepID(data._id, this)

        await super._preCreate(data, options, user)
    }

    _preUpdate(updateData, options, user) {
        if (hasProperty(updateData, "system.quantity") && updateData.system.quantity < 0)
            updateData.system.quantity = 0;
        if (getProperty(updateData, "system.type") == "corruption")
            setProperty(updateData, "system.specification", "corruption")
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
            this.system.damage = this.Ammo.damage
            this.system.ap = this.Ammo.ap
            this.system.ed = this.Ammo.ed
        }
        if (this.isRanged && this.Ammo) {
            this.applyAmmo()
        }
    }

    async sendToChat() {
        const item = new CONFIG.Item.documentClass(this._source)
        if (item.img.includes("/unknown")) {
            item.img = null;
        }

        const html = await renderTemplate("systems/wrath-and-glory/template/chat/item.html", { item, data: item.system });
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
            if (e.disabled) return changes;
            return changes.concat(e.changes.map(c => {
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
            let existing = this.system.traits.find(i => i.name == trait.name)
            if (!existing)
                this.system.traits.push(trait)
            else if (existing && Number.isNumeric(trait.rating))
                existing.rating = parseInt(existing.rating) + parseInt(trait.rating)
        })

        remove.forEach(trait => {
            let existing = this.system.traits.find(i => i.name == trait.name)
            let existingIndex = this.system.traits.findIndex(i => i.name == trait.name)
            if (existing) {
                if (trait.rating && Number.isNumeric(trait.rating)) {
                    existing.rating = parseInt(existing.rating) - parseInt(trait.rating)
                    if (existing.rating <= 0)
                        this.system.traits.splice(existingIndex, 1)
                }
                else {
                    this.system.traits.splice(existingIndex, 1)
                }
            }
        })

    }

    handleArchetypeItem(item)
    {
        if (["weapon", "weaponUpgrade", "armour", "gear", "ammo", "augmentic"].includes(item.type))
        {
            let wargear = duplicate(this.wargear);
            wargear.push({
                name : item.name,
                id : item.id,
                type: "item",
                diff : {}
            })
            let groups = this.addToGroup({index: wargear.length - 1, type : "item"})
            return this.update({"data.wargear" : wargear, "data.groups" : groups})
        }
        if(item.type == "ability")
        {
            return this.update({"data.ability.id" : item.id, "data.ability.name" : item.name})
        }
        if(item.type == "faction")
        {
            return this.update({"data.faction.id" : item.id, "data.faction.name" : item.name})
        }
        if(item.type == "species")
        {
            return this.update({"data.species.id" : item.id, "data.species.name" : item.name})
        }
        if (item.type == "talent")
        {   
            let talents = duplicate(this.suggested.talents)
            talents.push({"id" : item.id, "name" : item.name})
            this.update({"data.suggested.talents" : talents})
        }
        if (item.type == "keyword")
        {
            let keywords = duplicate(this.keywords)
            keywords.push(item.name)
            this.update({"data.keywords" : keywords})
        }
    }

    handleSpeciesItem(item)
    {
        if(item.type == "ability")
        {
            let abilities = duplicate(this.abilities);
            abilities.push({id : item.id, name : item.name})
            return this.update({"data.abilities" : abilities})
        }
    }
    
    addToGroup(object)
    {
        let groups = duplicate(this.groups)
        object.groupId = randomID()
        groups.items.push(object)
        return groups
    }

    resetGroups()
    {
        this.update({ "data.groups": {type: "and", groupId: "root", items : Array.fromRange(this.wargear.length).map(i => {return {type: "item", index : i, groupId : randomID()}})} }) // Reset item groupings
    }

    _deleteIndex(index, path)
    {
        let array = duplicate(getProperty(this.data, path))
        array.splice(index, 1)
        this.update({ [path]: array})
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


        /**
     * Override update to account for archetype parent
     */
         async update(data={}, context={}) 
         {
             // If this item is from an archetype entry, update the diff instead of the actual item
             // I would like to have done this is the item's _preCreate but the item seems to lose 
             // its "archetype" reference so it has to be done here
             // TODO: Current Issue - changing a property, then changing back to the original value
             // does not work due to `diffObject()`
     
             if (this.archetype) {
                 // Get the archetype's equipment, find the corresponding object, add to its diff
     
                 let list = duplicate(getProperty(this.archetype.data, this.archetypeItemPath))
                 let item = list[this.archetypeItemIndex];
                 mergeObject( // Merge current diff with new diff
                 item.diff,
                 diffObject(this.toObject(), data),
                 { overwrite: true })
         
                 // If the diff includes the item's name, change the name stored in the archetype
                 if (item.diff.name)
                 item.name = item.diff.name
                 else
                 item.name = this.name
     
                 this.archetype.update({ [`${this.archetypeItemPath}`]: list })
                 data={}
             }
             return super.update(data, context)
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
        this.system.traits.forEach(i => {

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


    async GetArchetypeItems() {
        let items = [];

        let species = game.wng.utility.findItem(this.species.id, "species")
        let faction = game.wng.utility.findItem(this.faction.id, "faction")

        let speciesAbilities = species.abilities.map(i => game.wng.utility.findItem(i.id, "ability"))
        let archetypeAbility = game.wng.utility.findItem(this.ability.id, "ability")
        let keywords = await Promise.all(this.keywords.map(WNGUtility.getKeywordItem))


        // Get all archetype talents, merge with diff
        let talents = this.suggested.talents.map(t => {
            let item = game.items.get(t.id)?.toObject();
            if (item)
                mergeObject(item, t.diff, {overwrite : true})
            return item
        })

        // Get all archetype talents, merge with diff
        let wargear = this.wargear.map(i => {
            let item = game.items.get(i.id)?.toObject();
            if (item)
                mergeObject(item, i.diff, {overwrite : true})
            return item
        })

        items = items.concat(
            [species], 
            [this],
            [faction],
            [archetypeAbility],
            speciesAbilities,
            keywords).map(i => i.toObject()).concat( // Wargear and talents are already objects
                talents,
                wargear
            )

        return items.filter(i => i);
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
                if (e.disabled) return false;
                if (!e.changes.length)
                    return true
                return e.changes.some(c => {
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
                if (e.disabled) return false;
                if (!e.changes.length)
                    return false
                return e.changes.some(c => {
                    return c.mode == 6
                })
            })
            return effects
        }
        else
            return []
    }

    get Journal() {
        return game.journal.get(this.journal)
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
        return (this.damage && (this.damage.base || this.damage.bonus || this.damage.rank != "none")) || (this.ed && (this.ed.base || this.ed.bonus || this.ed.rank != "none") || (this.otherDamage.shock || this.otherDamage.wounds || this.otherDamage.mortalWounds))
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
            return (0, eval)(Roll.replaceFormulaData(this.dn, target.actor.getRollData()))
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
    get ammo() { return this.system.ammo }
    get bonus() { return this.system.bonus }
    get effect() { return this.system.effect }
    get cost() { return this.system.cost }
    get requirements() { return this.system.requirements }
    get description() { return this.system.description }
    get display() { return this.system.display }
    get value() { return this.system.value }
    get rarity() { return this.system.rarity }
    get keywords() { return this.system.keywords }
    get quantity() { return this.system.quantity }
    get rating() { return this.system.rating }
    get traits() { return this.system.traits }
    get influence() { return this.system.influence }
    get benefits() { return this.system.benefits }
    get dn() { return this.system.dn }
    get activation() { return this.system.activation }
    get duration() { return this.system.duration }
    get range() { return this.system.range }
    get multiTarget() { return this.system.multiTarget }
    get prerequisites() { return this.system.prerequisites }
    get potency() { return this.system.potency }
    get damage() { return this.system.damage }
    get otherDamage() { return this.system.otherDamage }
    get ed() { return this.system.ed }
    get attack() { return this.system.attack }
    get ap() { return this.system.ap }
    get category() { return this.system.category }
    get salvo() { return this.system.salvo }
    get upgrades() { return this.system.upgrades || []}
    get equipped() { return this.system.equipped }
    get test() { return this.system.test }
    get abilityType() { return this.system.abilityType }
    get tier() { return this.system.tier}
    get species() { return this.system.species}
    get attributes() { return this.system.attributes}
    get attributeMax() { return this.system.attributeMax}
    get skills() { return this.system.skills}
    get ability() { return this.system.ability}
    get abilities() { return this.system.abilities}
    get wargear() { return this.system.wargear}
    get groups() { return this.system.groups}
    get suggested() { return this.system.suggested}
    get journal() { return this.system.journal}
    get objectives() { return this.system.objectives}
    get faction() { return this.system.faction}
    get size() { return this.system.size}
    get speed() { return this.system.speed}
    get backgrounds() {return this.system.backgrounds}


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
import WNGUtility from "../common/utility.js";

export class WrathAndGloryItem extends WarhammerItem {

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

    _preUpdate(updateData, options, user) {
        // TODO Move this to model
        if (getProperty(updateData, "system.type") == "corruption")
            setProperty(updateData, "system.specification", "corruption")
    }

    async sendToChat() {
        const item = new CONFIG.Item.documentClass(this._source)
        if (item.img.includes("/unknown")) {
            item.img = null;
        }

        const html = await renderTemplate("systems/wrath-and-glory/template/chat/item.hbs", { item, data: item.system });
        const chatData = {
            user: game.user.id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            "flags.wrath-and-glory.itemData": this.toObject()
        };

        ChatMessage.applyRollMode(chatData, chatData.rollMode);
        ChatMessage.create(chatData);
    }


    _dropdownData() {
        return { text: this.description }
    }

    // TODO move this to model
    handleArchetypeItem(item)
    {
        if (["weapon", "weaponUpgrade", "armour", "gear", "ammo", "augmentic"].includes(item.type))
        {
            let wargear = duplicate(this.wargear);
            wargear.push({
                name : item.name,
                id : item.uuid,
                type: "item",
                diff : {}
            })
            let groups = this.addToGroup({index: wargear.length - 1, type : "item"})
            return this.update({"system.wargear" : wargear, "system.groups" : groups})
        }
        if(item.type == "ability")
        {
            return this.update({"system.ability.id" : item.uuid, "system.ability.name" : item.name})
        }
        if(item.type == "faction")
        {
            return this.update({"system.faction.id" : item.uuid, "system.faction.name" : item.name})
        }
        if(item.type == "species")
        {
            return this.update({"system.species.id" : item.uuid, "system.species.name" : item.name})
        }
        if (item.type == "talent")
        {
            let talents = duplicate(this.suggested.talents.list)
            talents.push({"id" : item.id, "name" : item.name})
            this.update({"system.suggested.talents" : talents})
        }
        if (item.type == "keyword")
        {
            let keywords = duplicate(this.keywords)
            keywords.push(item.name)
            this.update({"system.keywords" : keywords})
        }
    }

    // TODO move this to model
    handleSpeciesItem(item)
    {
        if(item.type == "ability")
        {
            let abilities = duplicate(this.abilities);
            abilities.push({id : item.uuid, name : item.name})
            return this.update({"system.abilities" : abilities})
        }
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
            effect.name = game.i18n.localize(effect.name)
            effect.statuses = [effect.id];
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
        let existing = this.effects.find(e => e.statuses.has(conditionKey))
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

                 let list = duplicate(getProperty(this.archetype, this.archetypeItemPath))
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



    get isMelee() {
        return this.system.isMelee
    }

    get isRanged() {
        return this.system.isRanged
    }

    get traitList() {
        return this.system.traits.obj;
    }

    // TODO move this to model
    async GetArchetypeItems() {
        let items = [];

        let species = await game.wng.utility.findItem(this.species.id, "species")
        let faction = game.wng.utility.findItem(this.faction.id, "faction")

        let speciesAbilities = species.abilities.map(i => game.wng.utility.findItem(i.id, "ability"))
        let archetypeAbility = game.wng.utility.findItem(this.ability.id, "ability")
        let keywords = this.keywords.map(WNGUtility.getKeywordItem)


        // Get all archetype talents/wargear, merge with diff
        for (let i of this.suggested.talents.list.concat(this.wargear.filter(k => k.id)))
        {
            let item = await game.wng.utility.findItem(i.id)
            if (item)
            {
                item = item.toObject();
                items.push(mergeObject(item, i.diff, {overwrite: true}))
            }
        }

        items = (await Promise.all(items.concat(
            [species],
            [this],
            [faction],
            [archetypeAbility],
            speciesAbilities,
            keywords)))
            .filter(i => i)
            .map(i => i instanceof Item ? i.toObject() : i)

        items.filter(i => ["weapon", "armour"].includes(i.type)).forEach(i => i.system.equipped = true)

        return items
    }



    get skill() {
        return this.getSkillFor(this.actor);
    }

    getSkillFor(actor)
    {
        if (actor)
        {
            if (this.type == "psychicPower")
                return actor.system.skills.psychicMastery
            else if (this.isMelee)
                return actor.system.skills.weaponSkill
            else
                return actor.system.skills.ballisticSkill
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
            return this.actor.itemTypes.ammo
        else if (this.category == "launcher")
            return this.actor.itemTypes.weapon.filter(i => i.category == "grenade-missile")
        else if (this.category == "grenade-missile")
            return [this]

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

    async showInJournal() {
        let journal = await fromUuid(this.journal)
        let page;
        if (journal instanceof JournalEntryPage)
        {
            page = journal;
            journal = journal.parent;
        }
        journal.sheet.render(true, {pageId : page?.id})
    }

    get rollable() {
        if (this.type == "ability") {
            if (this.abilityType == "determination") return true
            if (this.hasDamage) return true
            if (this.hasTest) return true
        }

    }
    
    get hasDamage() {
        return (this.damage && (this.damage.base || this.damage.bonus || this.damage.rank != "none")) || (this.damage?.ed && (this.damage?.ed.base || this.damage?.ed.bonus || this.damage?.ed.rank != "none") || (this.damage?.otherDamage.shock || this.damage?.otherDamage.wounds || this.damage?.otherDamage.mortalWounds))
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
    get otherDamage() { return this.system.damage.otherDamage }
    get ed() { return this.system.damage.ed }
    get attack() { return this.system.attack }
    get ap() { return this.system.damage.ap }
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
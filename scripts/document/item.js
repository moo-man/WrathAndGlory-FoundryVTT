import WNGUtility from "../common/utility.js";
import { PostedItemMessageModel } from "../model/message/item.js";

export class WrathAndGloryItem extends WarhammerItem {

    static bracket = ["[", "]"];

    _preUpdate(updateData, options, user) {
        // TODO Move this to model
        if (getProperty(updateData, "system.type") == "corruption")
            setProperty(updateData, "system.specification", "corruption")
    }

    async postItem() {
        PostedItemMessageModel.postItem(this)
    }


    _dropdownData() {
        return { text: this.description }
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
            return this.createEmbeddedDocuments("ActiveEffect", [effect],  {condition: true})
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

    getTestData()
    {
        return this.system.test;
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

    hasKeyword(keyword) 
    {

        if (typeof keyword == "string")
        {
            keyword = [keyword];
        }

        let keywords = this.keywords.split(",").map(i => i.trim());

        return keyword.some(k => keywords.includes(k));
    }

    // TODO move this to model
    async GetArchetypeItems() {
        let items = [];

        let species = await this.system.species.document;
        let faction = await this.system.faction.document;

        let speciesAbilities = await species.system.abilities.awaitDocuments();
        let archetypeAbilities = await this.system.abilities.documents;
        let keywords = this.keywords.map(WNGUtility.getKeywordItem)


        // Get all archetype talents/wargear, merge with diff
        items = items.concat(this.suggested.talents.documents).concat(this.wargear.options.map(w => this.wargear.getOptionDocument(w.id)));

        items = (await Promise.all(items.concat(
            [species],
            [this],
            [faction],
            archetypeAbilities,
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
        let list = [];
        if (!this.isOwned)
            return
        if (this.category == "ranged")
            list = this.actor.itemTypes.ammo
        else if (this.category == "launcher")
            list = this.actor.itemTypes.weapon.filter(i => i.category == "grenade-missile")
        else if (this.category == "grenade-missile")
            return [this]

        return list.map(i => {
            let data = i.toObject();
            data.name += ` (${i.system.quantity})`
            return data;
        })
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
    

    get hasTest() {
        return this.test && this.test.type
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
    get keywords() { return this.system.keywords || "" }
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
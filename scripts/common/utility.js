import { WrathAndGloryItem } from "../item/item.js";

export default class WNGUtility {
  /**
   * Searches an object for a key that matches the given value.
   * 
   * @param {String} value  value whose key is being searched for
   * @param {Object} obj    object to be searched in
   */
  static findKey(value, obj, options = {}) {
    if (!value || !obj)
      return undefined;

    if (options.caseInsensitive) {
      for (let key in obj) {
        if (obj[key].toLowerCase() == value.toLowerCase())
          return key;
      }
    }
    else {
      for (let key in obj) {
        if (obj[key] == value)
          return key;
      }
    }
  }


  static getAttributeCostTotal(rating, base = 0) {
    let total = 0

    for (let i = base; i < rating; i++)
      total += this.getAttributeCostIncrement(i + 1)
    return total
  }

  static getSkillCostTotal(rating, base = 0) {
    let total = 0

    for (let i = base; i < rating; i++)
      total += this.getSkillCostIncrement(i + 1)
    return total
  }

  static getAttributeCostIncrement(rating) {
    let costs = game.wng.config.attributeCosts
    if (rating >= costs.length)
      return 50
    else return costs[rating]
  }

  static getSkillCostIncrement(rating) {
    return rating * 2
  }

  static getSpeaker(speaker) {
    try {
      if (speaker.actor)
        return game.actors.get(speaker.actor)
      else if (speaker.token && speaker.scene)
        return game.scenes.get(speaker.scene).tokens.get(speaker.token).actor
      else
        throw "Could not find speaker"
    }
    catch (e) {
      throw new Error(e)
    }
  }

  static async getKeywordItem(name) {

    let item = game.items.contents.find(i => i.type == "keyword" && i.name.toLowerCase() == name.toLowerCase())
    if (!item) {
      let packs = game.wng.tags.getPacksWithTag("keyword")
      for (let pack of packs) {
        let i = pack.index.contents.find(i => i.name == name)
        if (i) { // If item is in pack
          item = await pack.getDocument(i._id)
        }
      }
    }


    if (item)
      return item
    else
      return new WrathAndGloryItem({ name, type: "keyword", img: "modules/wng-core/assets/ui/aquila-white.webp" })
  }

  static _keepID(id, document) {
    try {
      let compendium = !!document.pack
      let world = !compendium
      let collection

      if (compendium) {
        let pack = game.packs.get(document.pack)
        collection = pack.index
      }
      else if (world)
        collection = document.collection

      if (collection.has(id)) {
        ui.notifications.notify(`${game.i18n.format("ERROR.ID", { name: document.name })}`)
        return false
      }
      else return true
    }
    catch (e) {
      console.error(e)
      return false
    }
  }

  static _getTargetDefence() {
    const targets = game.user.targets.size;
    if (0 >= targets) {
      return 3;
    }

    return game.user.targets.values().next().value.actor.combat.defence.total;
  }

  /**
   * Given an ID, find an item within the world, and if necessary, search the compendium using the type argument
   * 
   * @param {String} id id of the item
   * @param {String} type type of item, e.g. 'weapon' 'armour' 'talent' etc.
   * @returns an Item object if the item is in the world, or a Promise of an Item if it was from the compendium
   */
  static findItem(id, type) {
    if (game.items.has(id))
      return game.items.get(id)

    let packs = game.wng.tags.getPacksWithTag(type)
    for (let pack of packs) {
      if (pack.index.has(id)) {
        return pack.getDocument(id)
      }
    }
  }

  static findJournal(id) {
    if (game.journal.has(id))
      return game.journal.get(id)

    let packs = game.packs.filter(i => i.metadata.type == "JournalEntry")
    for (let pack of packs) {
      if (pack.index.has(id)) {
        return pack.getDocument(id)
      }
    }
  }

  static highlightToken(ev) {
    if (!canvas.ready) return;
    const li = ev.target;
    let tokenId = li.dataset.tokenId
    const token = canvas.tokens.get(tokenId);
    if (token?.isVisible) {
      if (!token._controlled) token._onHoverIn();
      this._highlighted = token;
    }
  }

  static unhighlightToken(ev) {
    const li = ev.target;
    let tokenId = li.dataset.tokenId
    if (this._highlighted) this._highlighted._onHoverOut();
    this._highlighted = null;
  }


  static focusToken(ev) {
    const li = ev.target;
    let tokenId = li.dataset.tokenId
    const token = canvas.tokens.get(tokenId);
    canvas.animatePan({ x: token.center.x, y: token.center.y, duration: 250 });
  }


  static async rollItemMacro(itemName, itemType) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);

    let item
    if (["weapon", "psychicPower", "ability"].includes(itemType)) {
      item = actor ? actor.getItemTypes(itemType).find(i => i.name === itemName) : null;
      if (!item) return ui.notifications.warn(`${game.i18n.localize("ERROR.MacroItemMissing")} ${itemName}`);
    }


    let test
    // Trigger the item roll
    switch (itemType) {
      case "attribute":
        test = await actor.setupAttributeTest(itemName)
        break;
      case "skill":
        test = await actor.setupSkill(itemName)
        break;
      case "weapon":
        test = await actor.setupWeaponTest(item)
        break;
      case "psychicPower":
        test = await actor.setupPowerTest(item)
        break;
      case "ability":
        test = await actor.setupAbilityRoll(item)
        break;
      default:
        test = await actor.setupGenericTest(itemType)
        break;
    }

    return Array.isArray(test)
      ? test.forEach(t => t.rollTest().then(roll => roll.sendToChat()))
      : test.rollTest().then(roll => roll.sendToChat())

  }

}
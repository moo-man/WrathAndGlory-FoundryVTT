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

}
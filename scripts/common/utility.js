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


  static getAttributeCostTotal(rating) {
    let total = 0

    for (let i = 0; i <= rating; i++)
      total += this.getAttributeCostIncrement(i)
    return total
  }

  static getSkillCostTotal(rating) {
    let total = 0

    for (let i = 0; i <= rating; i++)
      total += this.getSkillCostIncrement(i)
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
}
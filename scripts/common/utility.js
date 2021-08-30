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
      total += this.getAttributeCostIncrement(rating)
    return total
  }

  static getSkillCostTotal(rating) {
    let total = 0

    for (let i = 0; i <= rating; i++)
      total += this.getSkillCostIncrement(rating)
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
}
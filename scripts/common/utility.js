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
}
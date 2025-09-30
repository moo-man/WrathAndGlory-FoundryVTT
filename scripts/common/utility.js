import { WrathAndGloryItem } from "../document/item.js";

export default class WNGUtility {

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
      for (let pack of game.packs) {

        let i = pack.index.contents.find(i => i.name == name && i.type == "keyword")
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

    if (id.includes("."))
      return fromUuid(id);

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

  // TODO remove this (church of steel, xenos), prefer @Embed
  static async tableToHTML(table, label, options=[]) 
  {
      let noCenter = options.includes("no-center");
      return await foundry.applications.ux.TextEditor.enrichHTML(`<table class="wng-generated" border="1"> 
      <thead>
      <tr class="table-header"><td colspan="2">@UUID[${table.uuid}]{${table.name}}</td></tr>
      <tr class="table-col-header">
          <td class="formula">${table.formula.replaceAll(" ", "") == "1d6*10+1d6" ? "1d66" : table.formula}</td>
          <td class="label">${label}</td>
      </tr>
      </thead>
      <tbody class="${noCenter ? "no-center" : ""}">
  ${table.results.map(r => 
  {
      let uuid;

      if (r.type == 1)
      {
          uuid = `${r.documentCollection}.${r.documentId}`;
      }
      else if (r.type == 2)
      {
          uuid = `Compendium.${r.documentCollection}.${r.documentId}`;
      }

      return `<tr>
          <td>${r.range[0] == r.range[1] ? r.range[0] : `${r.range[0]}–${r.range[1]}`}</td>
          <td>${[1,2].includes(r.type) ? `@UUID[${uuid}]` : r.text}</td>
          </tr>`;
  }).join("")}

      </tbody>
  </table>`, {relativeTo : table, async: true});
  }


  static async rollItemMacro(itemName, itemType) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);

    let item
    if (["weapon", "psychicPower", "ability"].includes(itemType)) {
      item = actor ? actor.itemTypes[itemType].find(i => i.name === itemName) : null;
      if (!item) return ui.notifications.warn(`${game.i18n.localize("ERROR.MacroItemMissing")} ${itemName}`);
    }


    let test
    // Trigger the item roll
    switch (itemType) {
      case "attribute":
        actor.setupAttributeTest(itemName)
        break;
      case "skill":
        actor.setupSkill(itemName)
        break;
      case "weapon":
        actor.setupWeaponTest(item)
        break;
      case "psychicPower":
        actor.setupPowerTest(item)
        break;
      case "ability":
        actor.setupAbilityRoll(item)
        break;
      default:
        actor.setupGenericTest(itemType)
        break;
    }

  }

}

export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};

function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/wrath-and-glory/template/sheet/agent.html",
    "systems/wrath-and-glory/template/sheet/threat.html",
    "systems/wrath-and-glory/template/sheet/tab/advances.html",
    "systems/wrath-and-glory/template/sheet/tab/bonus.html",
    "systems/wrath-and-glory/template/sheet/tab/combat.html",
    "systems/wrath-and-glory/template/sheet/tab/combat-threat.html",
    "systems/wrath-and-glory/template/sheet/tab/gear.html",
    "systems/wrath-and-glory/template/sheet/tab/gear-threat.html",
    "systems/wrath-and-glory/template/sheet/tab/notes.html",
    "systems/wrath-and-glory/template/sheet/tab/settings.html",
    "systems/wrath-and-glory/template/sheet/tab/stats.html",
    "systems/wrath-and-glory/template/sheet/tab/talents.html",
    "systems/wrath-and-glory/template/sheet/keyword.html",
    "systems/wrath-and-glory/template/sheet/talent.html",
    "systems/wrath-and-glory/template/sheet/ability.html",
    "systems/wrath-and-glory/template/sheet/psychic-power.html",
    "systems/wrath-and-glory/template/sheet/armour.html",
    "systems/wrath-and-glory/template/sheet/weapon.html",
    "systems/wrath-and-glory/template/sheet/weapon-upgrade.html",
    "systems/wrath-and-glory/template/sheet/gear.html",
    "systems/wrath-and-glory/template/sheet/ascension.html",
    "systems/wrath-and-glory/template/sheet/traumatic-injury.html",
    "systems/wrath-and-glory/template/sheet/memorable-injury.html",
    "systems/wrath-and-glory/template/sheet/mutation.html",
    "systems/wrath-and-glory/template/sheet/ammo.html",
    "systems/wrath-and-glory/template/sheet/augmentic.html",
    "systems/wrath-and-glory/template/chat/item.html",
    "systems/wrath-and-glory/template/chat/roll.html",
    "systems/wrath-and-glory/template/chat/damage.html",
    "systems/wrath-and-glory/template/dialog/common-roll.html",
    "systems/wrath-and-glory/template/dialog/weapon-roll.html",
    "systems/wrath-and-glory/template/dialog/psychic-roll.html"
  ];
  return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper("removeMarkup", function (text) {
    const markup = /<(.*?)>/gi;
    return text.replace(markup, "");
  });
  Handlebars.registerHelper("range", function (data) {
    const short = data.range.short < 1 ? "-" : data.range.short;
    const medium = data.range.medium < 1 ? "-" : data.range.medium;
    const long = data.range.long < 1 ? "-" : data.range.long;
    const salvo = data.salvo < 1 ? "-" : data.salvo;
    return `${salvo} | ${short} / ${medium} / ${long}`;
  });
  Handlebars.registerHelper("activation", function (activation) {
    switch (activation) {
      case "free":
        return game.i18n.localize("ACTIVATION.FREE");
      case "action":
        return game.i18n.localize("ACTIVATION.ACTION");
      case "simple":
        return game.i18n.localize("ACTIVATION.SIMPLE");
      case "full":
        return game.i18n.localize("ACTIVATION.FULL");
      case "movement":
        return game.i18n.localize("ACTIVATION.MOVEMENT");
      default:
        return game.i18n.localize("ACTIVATION.ACTION");
    }
  });
  Handlebars.registerHelper("multiTarget", function (isMultiTarget) {
    if (isMultiTarget) {
        return game.i18n.localize("DIALOG.YES");
    } else {
      return game.i18n.localize("DIALOG.NO")
    }
  });
  Handlebars.registerHelper("rarity", function (rarity) {
    switch (rarity) {
      case "common":
        return game.i18n.localize("RARITY.COMMON");
      case "uncommon":
        return game.i18n.localize("RARITY.UNCOMMON");
      case "rare":
        return game.i18n.localize("RARITY.RARE");
      case "very-rare":
        return game.i18n.localize("RARITY.VERY_RARE");
      case "unique":
        return game.i18n.localize("RARITY.UNIQUE");
      default:
        return game.i18n.localize("RARITY.COMMON");
    }
  });
  Handlebars.registerHelper("category", function (category) {
    switch (category) {
      case "melee":
        return game.i18n.localize("CATEGORY.MELEE");
      case "ranged":
        return game.i18n.localize("CATEGORY.RANGED");
      default:
        return game.i18n.localize("CATEGORY.MELEE");
    }
  });
  Handlebars.registerHelper("size", function (size) {
    switch (size) {
      case "tiny":
        return game.i18n.localize("SIZE.TINY");
      case "small":
        return game.i18n.localize("SIZE.SMALL");
      case "average":
        return game.i18n.localize("SIZE.AVERAGE");
      case "large":
        return game.i18n.localize("SIZE.LARGE");
      case "huge":
        return game.i18n.localize("SIZE.HUGE");
      case "gargantuan":
        return game.i18n.localize("SIZE.GARGANTUAN");
      default:
        return game.i18n.localize("SIZE.AVERAGE");
    }
  });
  Handlebars.registerHelper("damage", function (data) {
    return _dataWithRank(data);
  });
  Handlebars.registerHelper("ed", function (data) {
    return _dataWithRank(data);
  });
  Handlebars.registerHelper("ap", function (data) {
    return _dataWithRank(data);
  });
}

function _dataWithRank(data) {
  let damage = data.base + data.bonus;
    let rank = "";
    if (data.rank === "single") {
      rank = " + R";
    } else if (data.rank === "double") {
      rank = " + DR";
    }
    return `${damage}${rank}`;
}
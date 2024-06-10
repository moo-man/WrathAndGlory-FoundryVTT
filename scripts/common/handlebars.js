export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};

function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/wrath-and-glory/template/actor/tab/effects.hbs",
    "systems/wrath-and-glory/template/item/tab/bonus.hbs",
    "systems/wrath-and-glory/template/item/tab/effects.hbs",
    "systems/wrath-and-glory/template/actor/tab/combat.hbs",
    "systems/wrath-and-glory/template/actor/tab/gear.hbs",
    "systems/wrath-and-glory/template/actor/tab/notes.hbs",
    "systems/wrath-and-glory/template/actor/tab/notes-threat.hbs",
    "systems/wrath-and-glory/template/actor/tab/settings.hbs",
    "systems/wrath-and-glory/template/actor/tab/stats.hbs",
    "systems/wrath-and-glory/template/actor/tab/talents.hbs",
    "systems/wrath-and-glory/template/actor/tab/vehicle/main.hbs",
    "systems/wrath-and-glory/template/actor/tab/vehicle/gear.hbs",
    "systems/wrath-and-glory/template/chat/roll/base/dice-container.hbs",
    "systems/wrath-and-glory/template/chat/roll/base/base-result.hbs",
    "systems/wrath-and-glory/template/chat/roll/base/base-roll.hbs",
    "systems/wrath-and-glory/template/chat/roll/base/base-buttons.hbs",
    "systems/wrath-and-glory/template/chat/roll/common/common-result.hbs",
    "systems/wrath-and-glory/template/chat/roll/common/common-buttons.hbs",
    "systems/wrath-and-glory/template/chat/roll/corruption/corruption-result.hbs",
    "systems/wrath-and-glory/template/chat/roll/corruption/corruption-buttons.hbs",
    "systems/wrath-and-glory/template/chat/roll/power/power-result.hbs",
    "systems/wrath-and-glory/template/chat/roll/power/power-buttons.hbs",
    "systems/wrath-and-glory/template/chat/roll/resolve/resolve-result.hbs",
    "systems/wrath-and-glory/template/chat/roll/weapon/weapon-result.hbs",
    "systems/wrath-and-glory/template/chat/roll/weapon/weapon-buttons.hbs",
    "systems/wrath-and-glory/template/chat/roll/determination/determination-result.hbs",
    "systems/wrath-and-glory/template/chat/roll/stealth/stealth-result.hbs",
    "systems/wrath-and-glory/template/chat/roll/mutation/mutation-result.hbs",
    "systems/wrath-and-glory/template/chat/roll/mutation/mutation-buttons.hbs",
    "systems/wrath-and-glory/template/apps/combatant-list.hbs",
    //"systems/wrath-and-glory/template/partials/damage.hbs",
  ];
  return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper("removeMarkup", function (text) {
    const markup = /<(.*?)>/gi;
    return text.replace(markup, "");
  });

  Handlebars.registerHelper("ifIsGM", function (options) {
    return game.user.isGM ? options.fn(this) : options.inverse(this)
  })

  Handlebars.registerHelper("isGM", function (options) {
    return game.user.isGM
  })

  Handlebars.registerHelper("config", function (key) {
    return game.wng.config[key]
  })

  Handlebars.registerHelper("configLookup", function (obj, key) {
    return game.wng.config[obj][key]
  })


  Handlebars.registerHelper("array", function (array, cls) {
    if (typeof cls == "string")
      return array.map(i => `<a class="${cls}">${i}</a>`).join(`,`)
    else
      return array.join(", ")
  })

  Handlebars.registerHelper("tokenImg", function (actor) {
    let tokens = actor.getActiveTokens();
    let tokenDocument = actor.prototypeToken;
    if (tokens.length == 1) {
      tokenDocument = tokens[0].document;
    }
    return tokenDocument.hidden ? "systems/wfrp4e/tokens/unknown.png" : tokenDocument.texture.src;
  })

  Handlebars.registerHelper("tokenName", function (actor) {
    let tokens = actor.getActiveTokens();
    let tokenDocument = actor.prototypeToken;
    if (tokens.length == 1) {
      tokenDocument = tokens[0].document;
    }
    return tokenDocument.hidden ? "???" : tokenDocument.name;
  })

  Handlebars.registerHelper("settings", function (key) {
    return game.settings.get("wfrp4e", key);
  })
}

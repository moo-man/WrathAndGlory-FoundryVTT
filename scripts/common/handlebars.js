export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};

function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/wrath-and-glory/template/actor/tab/effects.html",
    "systems/wrath-and-glory/template/item/tab/bonus.html",
    "systems/wrath-and-glory/template/item/tab/effects.html",
    "systems/wrath-and-glory/template/actor/tab/combat.html",
    "systems/wrath-and-glory/template/actor/tab/gear.html",
    "systems/wrath-and-glory/template/actor/tab/notes.html",
    "systems/wrath-and-glory/template/actor/tab/notes-threat.html",
    "systems/wrath-and-glory/template/actor/tab/settings.html",
    "systems/wrath-and-glory/template/actor/tab/stats.html",
    "systems/wrath-and-glory/template/actor/tab/talents.html"
    //"systems/wrath-and-glory/template/partials/damage.html",
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
}
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
    "systems/wrath-and-glory/template/actor/tab/talents.html",
    "systems/wrath-and-glory/template/actor/tab/vehicle/main.html",
    "systems/wrath-and-glory/template/actor/tab/vehicle/gear.html",
    "systems/wrath-and-glory/template/chat/roll/base/dice-container.html",
    "systems/wrath-and-glory/template/chat/roll/base/base-result.html",
    "systems/wrath-and-glory/template/chat/roll/base/base-roll.html",
    "systems/wrath-and-glory/template/chat/roll/base/base-buttons.html",
    "systems/wrath-and-glory/template/chat/roll/common/common-result.html",
    "systems/wrath-and-glory/template/chat/roll/common/common-buttons.html",
    "systems/wrath-and-glory/template/chat/roll/corruption/corruption-result.html",
    "systems/wrath-and-glory/template/chat/roll/corruption/corruption-buttons.html",
    "systems/wrath-and-glory/template/chat/roll/power/power-result.html",
    "systems/wrath-and-glory/template/chat/roll/power/power-buttons.html",
    "systems/wrath-and-glory/template/chat/roll/resolve/resolve-result.html",
    "systems/wrath-and-glory/template/chat/roll/weapon/weapon-result.html",
    "systems/wrath-and-glory/template/chat/roll/weapon/weapon-buttons.html",
    "systems/wrath-and-glory/template/chat/roll/determination/determination-result.html",
    "systems/wrath-and-glory/template/chat/roll/stealth/stealth-result.html",
    "systems/wrath-and-glory/template/chat/roll/mutation/mutation-result.html",
    "systems/wrath-and-glory/template/chat/roll/mutation/mutation-buttons.html",
    "systems/wrath-and-glory/template/apps/combatant-list.html",
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


  Handlebars.registerHelper("enrich", function (string) {
    return  TextEditor.enrichHTML(string, {async: false})
})


  Handlebars.registerHelper("array", function (array, cls) {
    if (typeof cls == "string")
        return array.map(i => `<a class="${cls}">${i}</a>`).join(`,`)
    else
        return array.join(", ")
})
}

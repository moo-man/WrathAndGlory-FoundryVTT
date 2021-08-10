export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};

function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/wrath-and-glory/template/actor/tab/advances.html",
    "systems/wrath-and-glory/template/item/tab/bonus.html",
    "systems/wrath-and-glory/template/actor/tab/combat.html",
    "systems/wrath-and-glory/template/actor/tab/gear.html",
    "systems/wrath-and-glory/template/actor/tab/notes.html",
    "systems/wrath-and-glory/template/actor/tab/settings.html",
    "systems/wrath-and-glory/template/actor/tab/stats.html",
    "systems/wrath-and-glory/template/actor/tab/talents.html",
  ];
  return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {

  Handlebars.registerHelper("multiTarget", function (isMultiTarget) {
    if (isMultiTarget) {
        return game.i18n.localize("DIALOG.YES");
    } else {
      return game.i18n.localize("DIALOG.NO")
    }
  });

}
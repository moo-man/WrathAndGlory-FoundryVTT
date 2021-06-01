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

  Handlebars.registerHelper("multiTarget", function (isMultiTarget) {
    if (isMultiTarget) {
        return game.i18n.localize("DIALOG.YES");
    } else {
      return game.i18n.localize("DIALOG.NO")
    }
  });

}
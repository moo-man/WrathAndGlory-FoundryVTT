export const initializeHandlebars = () => {
  const templatePaths = [
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
  ];
  loadTemplates({
    test : "systems/wrath-and-glory/template/partials/test.hbs",
    chatTargets : "systems/wrath-and-glory/template/partials/chat-targets.hbs",
    listEffect : "systems/wrath-and-glory/template/partials/list-effect.hbs",

    testDetails : "systems/wrath-and-glory/templates/item/partials/test.hbs",
    physical : "systems/wrath-and-glory/templates/item/partials/physical.hbs",
    traitsMod : "systems/wrath-and-glory/templates/item/partials/traits-mod.hbs",
    traits : "systems/wrath-and-glory/templates/item/partials/traits.hbs",
    damage : "systems/wrath-and-glory/templates/item/partials/damage.hbs"
  })
  return loadTemplates(templatePaths);
};
export const initializeHandlebars = () => {
  const templatePaths = [
    "systems/wrath-and-glory/templates/chat/roll/base/dice-container.hbs",
    "systems/wrath-and-glory/templates/chat/roll/base/base-result.hbs",
    "systems/wrath-and-glory/templates/chat/roll/base/base-roll.hbs",
    "systems/wrath-and-glory/templates/chat/roll/base/base-buttons.hbs",
    "systems/wrath-and-glory/templates/chat/roll/common/common-result.hbs",
    "systems/wrath-and-glory/templates/chat/roll/common/common-buttons.hbs",
    "systems/wrath-and-glory/templates/chat/roll/corruption/corruption-result.hbs",
    "systems/wrath-and-glory/templates/chat/roll/corruption/corruption-buttons.hbs",
    "systems/wrath-and-glory/templates/chat/roll/power/power-result.hbs",
    "systems/wrath-and-glory/templates/chat/roll/power/power-buttons.hbs",
    "systems/wrath-and-glory/templates/chat/roll/resolve/resolve-result.hbs",
    "systems/wrath-and-glory/templates/chat/roll/weapon/weapon-result.hbs",
    "systems/wrath-and-glory/templates/chat/roll/weapon/weapon-buttons.hbs",
    "systems/wrath-and-glory/templates/chat/roll/determination/determination-result.hbs",
    "systems/wrath-and-glory/templates/chat/roll/stealth/stealth-result.hbs",
    "systems/wrath-and-glory/templates/chat/roll/mutation/mutation-result.hbs",
    "systems/wrath-and-glory/templates/chat/roll/mutation/mutation-buttons.hbs",
  ];
  foundry.applications.handlebars.loadTemplates({
    chatTargets : "systems/wrath-and-glory/templates/partials/chat-targets.hbs",
    listEffect : "systems/wrath-and-glory/templates/partials/list-effect.hbs",
    testDetails : "systems/wrath-and-glory/templates/item/partials/test.hbs",
    physical : "systems/wrath-and-glory/templates/item/partials/physical.hbs",
    traitsMod : "systems/wrath-and-glory/templates/item/partials/traits-mod.hbs",
    traits : "systems/wrath-and-glory/templates/item/partials/traits.hbs",
    damage : "systems/wrath-and-glory/templates/item/partials/damage.hbs",
    combatant : "systems/wrath-and-glory/templates/apps/combatant.hbs"
  })
  return foundry.applications.handlebars.loadTemplates(templatePaths);
};
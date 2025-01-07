export default function () {
  game.settings.register("wrath-and-glory", "systemMigrationVersion", {
    name: "System Migration Version",
    hint: "Used to automatically upgrade worlds data when the system is upgraded.",
    scope: "world",
    config: false,
    default: "1.0.0",
    type: String,
  });

  game.settings.register('wrath-and-glory', 'initiativeRollOption', {
    name: 'I Wanna Roll!',
    hint: 'Determine Initiative by rolling as described on page 177 in the Core Rulebook',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register('wrath-and-glory', 'playerCounterEdit', {
    name: 'Allow Players To Edit Glory',
    hint: 'Players will be able to change Glory counter values manually.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register('wrath-and-glory', 'glory', {
    name: 'Glory',
    scope: 'world',
    config: false,
    default: 0,
    type: Number,
  });


  game.settings.register('wrath-and-glory', 'ruin', {
    name: 'Ruin',
    scope: 'world',
    config: false,
    default: 0,
    type: Number,
  });

  game.settings.register('wrath-and-glory', 'counterPosition', {
    name: 'Counter Position',
    scope: 'client',
    config: false,
    default: {},
    type: Object,
  });


  game.settings.register('wrath-and-glory', 'bugReportName', {
    name: 'Bug Report Name',
    scope: 'world',
    config: false,
    default: "",
    type: String,
  });

  game.settings.register('wrath-and-glory', 'advancedArmour', {
    name: 'Advanced Armour',
    hint: 'Handle Armour and Armour Penetration as described on page 232.',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
}
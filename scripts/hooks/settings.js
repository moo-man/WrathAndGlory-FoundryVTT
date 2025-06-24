import TableSettings from "../apps/table-settings";
import WnGThemeConfig from "../apps/theme";

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


  game.settings.register('wrath-and-glory', 'ruinMax', {
    name: 'Maximum Ruin',
    hint: 'Caps the amount of Ruin in the counter.',
    scope: 'world',
    config: true,
    default: 8,
    type: Number,
  });

  game.settings.register('wrath-and-glory', 'gloryMax', {
    name: 'Maximum Glory',
    hint: 'Caps the amount of Glory in the counter.',
    scope: 'world',
    config: true,
    default: 6,
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

  
  game.settings.register("wrath-and-glory", "postedIssues", {
    name: "Posted Issues",
    scope: "world",
    config: false,
    default: [],
    type: Array
  });

  game.settings.registerMenu("wrath-and-glory", "tableSettingsMenu", {
    name : game.i18n.localize("SETTINGS.TableSettings"),
    label : game.i18n.localize("SETTINGS.TableConfigure"),
    hint : game.i18n.localize("SETTINGS.TableSettingsHint"),
    icon : "fa-solid fa-list",
    type : TableSettings,
    restricted : true
})  ;

game.settings.register("wrath-and-glory", "tableSettings", {
    name: "SETTINGS.TableSettings",
    scope: "world",
    config: false,
    type: TableSettings.schema
});

  game.settings.registerMenu("wrath-and-glory", "themeConfig", {
    name: "WH.Theme.Config",
    label : "WH.Theme.ConfigButton",
    hint : "WH.Theme.ConfigHint",
    icon: "fa-solid fa-table-layout",
    scope: "user",
    config: true,
    type: WnGThemeConfig
  });

  game.settings.register("wrath-and-glory", "theme", {
    name: "Theme",
    scope: "client",
    config: false,
    type: WnGThemeConfig.schema
});

}
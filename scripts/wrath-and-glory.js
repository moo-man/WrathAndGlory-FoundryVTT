import { WrathAndGloryActor } from "./actor/actor.js";
import { WrathAndGloryItem } from "./item/item.js";
import { AgentSheet } from "./actor/sheet/agent.js";
import { ThreatSheet } from "./actor/sheet/threat.js";
import { initializeHandlebars } from "./common/handlebars.js";
import hooks from "./common/hooks.js"
import RuinGloryCounter from "./apps/counter.js"
import ItemTraits from "./apps/item-traits.js"
import WNG from "./common/config.js"
import { WrathAndGloryItemSheet } from "./item/sheet/item-sheet.js";
import WNGUtility from "./common/utility.js"
import { WNGTest, WrathDie, PoolDie } from "./common/tests/test.js";
import WeaponTest from "./common/tests/weapon-test.js";
import WrathAndGloryEffect from "./common/effect.js";
import WrathAndGloryEffectSheet from "./apps/active-effect-config.js";
import PowerTest from "./common/tests/power-test.js";
import CorruptionTest from "./common/tests/corruption-test.js";
import MutationTest from "./common/tests/mutation-test.js";
import ResolveTest from "./common/tests/resolve-test.js";
import DeterminationRoll from "./common/tests/determination.js";
import StealthRoll from "./common/tests/stealth.js";
import AbilityRoll from "./common/tests/ability-roll.js";
import ModuleInitializer from "./apps/module-initialization.js"
import ModuleUpdater from "./apps/module-updater.js"
import {migrateWorld} from "./common/migration.js"
import TagManager from "./common/tag-manager.js";
import { WrathAndGloryCombat, WrathAndGloryCombatant } from "./common/combat.js";
import WrathANdGloryCombatTracker from "./apps/combat-tracker.js";
import { WrathAndGloryOptionalCombat } from "./common/combat-optional.js";
import settings from "./hooks/settings.js";
import { AgentData } from "./actor/data/agent.js";
import { Level4TextPageSheet } from "./apps/journal-sheet.js";



Hooks.once("init", () => {

  settings()
  CONFIG.Actor.documentClass = WrathAndGloryActor;
  CONFIG.Item.documentClass = WrathAndGloryItem;
  CONFIG.ActiveEffect.documentClass = WrathAndGloryEffect;
  CONFIG.ActiveEffect.sheetClass = WrathAndGloryEffectSheet;
  DocumentSheetConfig.registerSheet(JournalEntryPage, "wrath-and-glory", Level4TextPageSheet, { types : ["text"], makeDefault: true, label : "W&G Journal Sheet" });

  
  if (game.settings.get("wrath-and-glory", "initiativeRollOption"))
  {
    CONFIG.Combat.documentClass = WrathAndGloryOptionalCombat;
  }
  else 
  {
    CONFIG.Combat.documentClass = WrathAndGloryCombat;
    CONFIG.ui.combat = WrathANdGloryCombatTracker
    CONFIG.Combatant.documentClass = WrathAndGloryCombatant
  }

  CONFIG.Actor.systemDataModels["agent"] = AgentData


  game.wng = {
    rollClasses : {
      WNGTest,
      WeaponTest,
      PowerTest,
      CorruptionTest,
      MutationTest,
      ResolveTest,
      DeterminationRoll,
      StealthRoll,
      AbilityRoll
    },
    dice : {
      WrathDie,
      PoolDie,
    },
    apps: {
      ModuleInitializer,
      ModuleUpdater
    },
    ItemTraits,
    RuinGloryCounter,
    utility : WNGUtility,
    migration : {migrateWorld},
    tags: new TagManager()
  };

  CONFIG.Dice.terms.w = WrathDie;
  CONFIG.Dice.terms.p = PoolDie;


  game.wng.config = WNG
  CONFIG.Combat.initiative = { formula: "(@attributes.initiative.total)dp", decimals: 0 };
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("wrath-and-glory", AgentSheet, { types: ["agent"], makeDefault: true });
  Actors.registerSheet("wrath-and-glory", ThreatSheet, { types: ["threat"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("wrath-and-glory", WrathAndGloryItemSheet, {makeDefault : true});
  DocumentSheetConfig.registerSheet(ActiveEffect, "wrath-and-glory", WrathAndGloryEffectSheet, {makeDefault: true, label : "Wrath & Glory Active Effect Config"})
  initializeHandlebars();

  CONFIG.fontDefinitions.Priori = {editor : true, fonts : []}
  CONFIG.defaultFontFamily = "Priori"
  CONFIG.canvasTextStyle._fontFamily = "Priori"

});


hooks()

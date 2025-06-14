import { initializeHandlebars } from "./common/handlebars.js";
import hooks from "./common/hooks.js"
import RuinGloryCounter from "./apps/counter.js"
import ItemTraits from "./apps/item-traits.js"
import WNG from "./common/config.js"
import WNGUtility from "./common/utility.js"
import { WNGTest, WrathDie, PoolDie } from "./common/tests/test.js";
import WeaponTest from "./common/tests/weapon-test.js";
import PowerTest from "./common/tests/power-test.js";
import CorruptionTest from "./common/tests/corruption-test.js";
import MutationTest from "./common/tests/mutation-test.js";
import ResolveTest from "./common/tests/resolve-test.js";
import DeterminationRoll from "./common/tests/determination.js";
import StealthRoll from "./common/tests/stealth.js";
import AbilityRoll from "./common/tests/ability-roll.js";
import Migration from "./common/migration.js"
import { WrathAndGloryCombat, WrathAndGloryCombatant } from "./common/combat.js";
import WrathANdGloryCombatTracker from "./apps/combat-tracker.js";
import { WrathAndGloryOptionalCombat } from "./common/combat-optional.js";
import settings from "./hooks/settings.js";
import { Level4TextPageSheet } from "./apps/journal-sheet.js";
import { AgentModel } from "./model/actor/agent.js"
import { ThreatModel } from "./model/actor/threat.js";
import { VehicleModel } from "./model/actor/vehicle.js";
import { WrathAndGloryActor } from "./document/actor.js";
import { WrathAndGloryItemSheet } from "./sheet/item-sheet.js";
import { WrathAndGloryItem } from "./document/item.js";
import WrathAndGloryEffect from "./document/effect.js";
import { DataslatePageSheet } from "./apps/dataslate.js";
import { AbilityModel } from "./model/item/ability.js";
import { AmmoModel } from "./model/item/ammo.js";
import { ArmourModel } from "./model/item/armour.js";
import { AscensionModel } from "./model/item/ascension.js";
import { AugmeticModel } from "./model/item/augmetic.js";
import { GearModel } from "./model/item/gear.js";
import { KeywordModel } from "./model/item/keyword.js";
import { MemorableInjuryModel } from "./model/item/memorableInjury.js";
import { MutationModel } from "./model/item/mutation.js";
import { PsychicPowerModel } from "./model/item/psychicPower.js";
import { SpeciesModel } from "./model/item/species.js";
import { TalentModel } from "./model/item/talent.js";
import { TraumaticInjuryModel } from "./model/item/traumaticInjury.js";
import { WeaponModel } from "./model/item/weapon.js";
import { WeaponUpgradeModel } from "./model/item/weaponUpgrade.js";
import { ArchetypeModel } from "./model/item/archetype.js";
import { FactionModel } from "./model/item/faction.js";
import { WrathAndGloryActiveEffectModel } from "./model/effect/effect.js";
import WrathAndGloryActiveEffectConfig from "./apps/effect-config.js";
import { WrathAndGloryDamageMessageModel, WrathAndGloryTestMessageModel } from "./model/message/message.js";
import loadEffects from "./loadEffects.js";
import { AgentSheet } from "./sheet/actor/agent.js";
import { ThreatSheet } from "./sheet/actor/threat.js";
import { VehicleSheet } from "./sheet/actor/vehicle.js";

Hooks.once("init", () => {

  settings()
  CONFIG.Actor.documentClass = WrathAndGloryActor;
  CONFIG.Item.documentClass = WrathAndGloryItem;
  CONFIG.ActiveEffect.documentClass = WrathAndGloryEffect;
  //CONFIG.ChatMessage.documentClass = SystemChatMessage;
  DocumentSheetConfig.registerSheet(JournalEntryPage, "wrath-and-glory", Level4TextPageSheet, { types : ["text"], makeDefault: true, label : "W&G Journal Sheet" });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "wrath-and-glory", DataslatePageSheet, { types : ["text"], makeDefault: false, label : "Data Slate" });

CONFIG.ActiveEffect.legacyTransferral = false;
CONFIG.ActiveEffect.dataModels["base"] = WrathAndGloryActiveEffectModel
CONFIG.ChatMessage.dataModels["test"] = WrathAndGloryTestMessageModel;
CONFIG.ChatMessage.dataModels["damage"] = WrathAndGloryDamageMessageModel;

DocumentSheetConfig.registerSheet(ActiveEffect, "system", WrathAndGloryActiveEffectConfig, {makeDefault : true});

Actors.unregisterSheet("core", ActorSheet);
Actors.registerSheet("wrath-and-glory", AgentSheet, { types: ["agent"], makeDefault: true });
Actors.registerSheet("wrath-and-glory", ThreatSheet, { types: ["threat"], makeDefault: true });
Actors.registerSheet("wrath-and-glory", VehicleSheet, { types: ["vehicle"], makeDefault: true });
Items.unregisterSheet("core", ItemSheet);
Items.registerSheet("wrath-and-glory", WrathAndGloryItemSheet, {makeDefault : true});

  
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

  CONFIG.Actor.dataModels["agent"] = AgentModel
  CONFIG.Actor.dataModels["threat"] = ThreatModel
  CONFIG.Actor.dataModels["vehicle"] = VehicleModel

  CONFIG.Item.dataModels["ability"] = AbilityModel
  CONFIG.Item.dataModels["ammo"] = AmmoModel
  CONFIG.Item.dataModels["armour"] = ArmourModel
  CONFIG.Item.dataModels["ascension"] = AscensionModel
  CONFIG.Item.dataModels["augmentic"] = AugmeticModel
  CONFIG.Item.dataModels["gear"] = GearModel
  CONFIG.Item.dataModels["keyword"] = KeywordModel
  CONFIG.Item.dataModels["memorableInjury"] = MemorableInjuryModel
  CONFIG.Item.dataModels["mutation"] = MutationModel
  CONFIG.Item.dataModels["psychicPower"] = PsychicPowerModel
  CONFIG.Item.dataModels["talent"] = TalentModel
  CONFIG.Item.dataModels["traumaticInjury"] = TraumaticInjuryModel
  CONFIG.Item.dataModels["weapon"] = WeaponModel
  CONFIG.Item.dataModels["weaponUpgrade"] = WeaponUpgradeModel
  CONFIG.Item.dataModels["archetype"] = ArchetypeModel
  CONFIG.Item.dataModels["species"] = SpeciesModel
  CONFIG.Item.dataModels["faction"] = FactionModel


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
    ItemTraits,
    RuinGloryCounter,
    utility : WNGUtility,
    migration : Migration
  };

  CONFIG.Dice.terms.w = WrathDie;
  CONFIG.Dice.terms.p = PoolDie;


  game.wng.config = WNG
  CONFIG.Combat.initiative = { formula: "(@attributes.initiative.total)dp", decimals: 0 };
  
  initializeHandlebars();

  CONFIG.fontDefinitions.Priori = {editor : true, fonts : []}
  CONFIG.defaultFontFamily = "Priori"
  CONFIG.canvasTextStyle._fontFamily = "Priori"

});


hooks()
loadEffects();
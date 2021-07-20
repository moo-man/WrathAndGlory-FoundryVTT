import { WrathAndGloryActor } from "./actor.js";
import { WrathAndGloryItem } from "./item.js";
import { AgentSheet } from "../sheet/agent.js";
import { ThreatSheet } from "../sheet/threat.js";
import { KeywordSheet } from "../sheet/keyword.js";
import { TalentSheet } from "../sheet/talent.js";
import { AbilitySheet } from "../sheet/ability.js";
import { PsychicPowerSheet } from "../sheet/psychic-power.js";
import { ArmourSheet } from "../sheet/armour.js";
import { WeaponSheet } from "../sheet/weapon.js";
import { WeaponUpgradeSheet } from "../sheet/weapon-upgrade.js";
import { GearSheet } from "../sheet/gear.js";
import { AscensionSheet } from "../sheet/ascension.js";
import { TraumaticInjurySheet } from "../sheet/traumatic-injury.js";
import { MemorableInjurySheet } from "../sheet/memorable-injury.js";
import { MutationSheet } from "../sheet/mutation.js";
import { AmmoSheet } from "../sheet/ammo.js";
import { AugmenticSheet } from "../sheet/augmentic.js";
import * as contextHooks from "../hooks/entryContext.js"
import { initializeHandlebars } from "./handlebars.js";
import { migrateWorld } from "./migration.js";
import { prepareCommonRoll, prepareWeaponRoll, prepareDamageRoll, preparePsychicRoll } from "./dialog.js";
import { commonRoll, weaponRoll, damageRoll, psychicRoll } from "./roll.js";

Hooks.once("init", () => {
  CONFIG.Actor.documentClass = WrathAndGloryActor;
  CONFIG.Item.documentClass = WrathAndGloryItem;
  game.wag = {
    prepareCommonRoll,
    prepareWeaponRoll,
    prepareDamageRoll,
    preparePsychicRoll,
    commonRoll,
    weaponRoll,
    psychicRoll,
    damageRoll
  };
  CONFIG.Combat.initiative = { formula: "(@attributes.initiative.total)d6", decimals: 0 };
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("wrath-and-glory", AgentSheet, { types: ["agent"], makeDefault: true });
  Actors.registerSheet("wrath-and-glory", ThreatSheet, { types: ["threat"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("wrath-and-glory", KeywordSheet, { types: ["keyword"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", TalentSheet, { types: ["talent"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", AbilitySheet, { types: ["ability"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", PsychicPowerSheet, { types: ["psychicPower"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", ArmourSheet, { types: ["armour"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", WeaponSheet, { types: ["weapon"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", WeaponUpgradeSheet, { types: ["weaponUpgrade"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", GearSheet, { types: ["gear"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", AscensionSheet, { types: ["ascension"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", TraumaticInjurySheet, { types: ["traumaticInjury"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", MemorableInjurySheet, { types: ["memorableInjury"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", MutationSheet, { types: ["mutation"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", AmmoSheet, { types: ["ammo"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", AmmoSheet, { types: ["ammo"], makeDefault: true });
  Items.registerSheet("wrath-and-glory", AugmenticSheet, { types: ["augmentic"], makeDefault: true });
  initializeHandlebars();
  game.settings.register("wrath-and-glory", "worldSchemaVersion", {
    name: "World Version",
    hint: "Used to automatically upgrade worlds data when the system is upgraded.",
    scope: "world",
    config: true,
    default: 0,
    type: Number,
  });

  contextHooks.default();
});

Hooks.once("ready", () => {
  migrateWorld();
});

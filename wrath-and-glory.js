import { WrathAndGloryActor } from "./scripts/actor/actor.js";
import { WrathAndGloryItem } from "./scripts/item/item.js";
import { AgentSheet } from "./scripts/actor/sheet/agent.js";
import { ThreatSheet } from "./scripts/actor/sheet/threat.js";
import { KeywordSheet } from "./scripts/item/sheet/keyword.js";
import { TalentSheet } from "./scripts/item/sheet/talent.js";
import { AbilitySheet } from "./scripts/item/sheet/ability.js";
import { PsychicPowerSheet } from "./scripts/item/sheet/psychicPower.js";
import { ArmourSheet } from "./scripts/item/sheet/armour.js";
import { WeaponSheet } from "./scripts/item/sheet/weapon.js";
import { WeaponUpgradeSheet } from "./scripts/item/sheet/weaponUpgrade.js";
import { GearSheet } from "./scripts/item/sheet/gear.js";
import { AscensionSheet } from "./scripts/item/sheet/ascension.js";
import { TraumaticInjurySheet } from "./scripts/item/sheet/traumaticInjury.js";
import { MemorableInjurySheet } from "./scripts/item/sheet/memorableInjury.js";
import { MutationSheet } from "./scripts/item/sheet/mutation.js";
import { AmmoSheet } from "./scripts/item/sheet/ammo.js";
import { AugmenticSheet } from "./scripts/item/sheet/augmentic.js";
import { initializeHandlebars } from "./scripts/common/handlebars.js";
import { prepareCommonRoll, prepareWeaponRoll, prepareDamageRoll, preparePsychicRoll } from "./scripts/common/dialog.js";
import { commonRoll, weaponRoll, damageRoll, psychicRoll } from "./scripts/common/roll.js";
import hooks from "./scripts/common/hooks.js"
import RuinGloryCounter from "./scripts/apps/counter.js"

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
    damageRoll,
    RuinGloryCounter
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
});


hooks()
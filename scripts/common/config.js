

const WNG = {}


WNG.attributes = {
    "strength" : "ATTRIBUTE.STRENGTH",
    "toughness" : "ATTRIBUTE.TOUGHNESS",
    "agility" : "ATTRIBUTE.AGILITY",
    "initiative" : "ATTRIBUTE.INITIATIVE",
    "willpower" : "ATTRIBUTE.WILLPOWER",
    "intellect" : "ATTRIBUTE.INTELLECT",
    "fellowship" : "ATTRIBUTE.FELLOWSHIP",
}

WNG.skills = {
    "athletics" : "SKILL.ATHLETICS",
    "awareness" : "SKILL.AWARENESS",
    "ballisticSkill" : "SKILL.BALLISTIC_SKILL",
    "cunning" : "SKILL.CUNNING",
    "deception" : "SKILL.DECEPTION",
    "insight" : "SKILL.INSIGHT",
    "intimidation" : "SKILL.INTIMIDATION",
    "investigation" : "SKILL.INVESTIGATION",
    "leadership" : "SKILL.LEADERSHIP",
    "medicae" : "SKILL.MEDICAE",
    "persuasion" : "SKILL.PERSUASION",
    "pilot" : "SKILL.PILOT",
    "psychicMastery" : "SKILL.PSYCHIC_MASTERY",
    "scholar" : "SKILL.SCHOLAR",
    "stealth" : "SKILL.STEALTH",
    "survival" : "SKILL.SURVIVAL",
    "tech" : "SKILL.TECH",
    "weaponSkill" : "SKILL.WEAPON_SKILL"
}

WNG.attributeAbbrev = {
    "strength" : "ATTRIBUTE.STRENGTH_ABREV",
    "toughness" : "ATTRIBUTE.TOUGHNESS_ABREV",
    "agility" : "ATTRIBUTE.AGILITY_ABREV",
    "initiative" : "ATTRIBUTE.INITIATIVE_ABREV",
    "willpower" : "ATTRIBUTE.WILLPOWER_ABREV",
    "intellect" : "ATTRIBUTE.INTELLECT_ABREV",
    "fellowship" : "ATTRIBUTE.FELLOWSHIP_ABREV",
}

WNG.skillAttribute = {
    "athletics" : "strength",
    "awareness" : "intellect",
    "ballisticSkill" : "agility",
    "cunning" : "fellowship",
    "deception" : "fellowship",
    "insight" : "fellowship",
    "intimidation" : "willpower",
    "investigation" : "intellect",
    "leadership" : "willpower",
    "medicae" : "intellect",
    "persuasion" : "fellowship",
    "pilot" : "agility",
    "psychicMastery" : "willpower",
    "scholar" : "intellect",
    "stealth" : "agility",
    "survival" : "willpower",
    "tech" : "intellect",
    "weaponSkill" : "initiative"
}

WNG.size = {
   tiny :  "SIZE.TINY",
   small :  "SIZE.SMALL",
   average :  "SIZE.AVERAGE",
   large :  "SIZE.LARGE",
   huge :  "SIZE.HUGE",
   gargantuan :  "SIZE.GARGANTUAN"
}


WNG.weaponTraits = {
    "agonising": "TRAIT.Agonising",
    "arc": "TRAIT.Arc",
    "assault": "TRAIT.Assault",
    "blast": "TRAIT.Blast",
    "brutal": "TRAIT.Brutal",
    "force": "TRAIT.Force",
    "flamer": "TRAIT.Flamer",
    "heavy": "TRAIT.Heavy",
    "inflict": "TRAIT.Inflict",
    "kustom": "TRAIT.Kustom",
    "melta": "TRAIT.Melta",
    "parry": "TRAIT.Parry",
    "pistol": "TRAIT.Pistol",
    "rad": "TRAIT.Rad",
    "rapidFire": "TRAIT.RapidFire",
    "reliable": "TRAIT.Reliable",
    "rending": "TRAIT.Rending",
    "silent": "TRAIT.Silent",
    "sniper": "TRAIT.Sniper",
    "spread": "TRAIT.Spread",
    "supercharge": "TRAIT.Supercharge",
    "unwieldy": "TRAIT.Unwieldy",
    "waaagh!": "TRAIT.Waaagh",
    "warpWeapons": "TRAIT.WarpWeapon"
}

WNG.armourTraits = {
    "bulk": "TRAIT.Bulk",
    "cumbersome": "TRAIT.Cumbersome",
    "ereWeGo": "TRAIT.EreWeGo",
    "powerField": "TRAIT.PowerField",
    "powered": "TRAIT.Powered",
    "shield": "TRAIT.Shield"
}

WNG.vehicleTraits = {
    "allTerrain": "All-Terrain",
    "amphibious": "Amphibious",
    "bike": "Bike",
    "flyer": "Flyer",
    "gunPorts": "Gun Ports",
    "gyroStabilised": "Gyro-Stabilised",
    "hover": "Hover",
    "openTopped": "Open Topped",
    "reliable": "Reliable",
    "sealed": "Sealed",
    "turboBoost": "Turbo Boost",
    "walker": "Walker",
}


WNG.traitHasRating = {
    "agonising": false,
    "arc": true,
    "assault": false,
    "blast": true,
    "brutal": false,
    "force": false,
    "flamer": false,
    "heavy": true,
    "inflict": true,
    "kustom": false,
    "melta": false,
    "parry": false,
    "pistol": false,
    "rad": true,
    "rapidFire": true,
    "reliable": false,
    "rending": true,
    "silent": false,
    "sniper": true,
    "spread": false,
    "supercharge": false,
    "unwieldy": true,
    "waaagh!": false,
    "warpWeapons": false,
    "bulk": true,
    "cumbersome": false,
    "ereWeGo": false,
    "powerField": false,
    "powered": true,
    "shield": false,
    "allTerrain": false,
    "amphibious": false,
    "bike": false,
    "flyer": false,
    "gunPorts": false,
    "gyroStabilised": false,
    "hover": false,
    "openTopped": false,
    "reliable": false,
    "sealed": false,
    "turboBoost": true,
    "walker": false
}

WNG.ranges = {
    "short" : "RANGE.SHORT",
    "medium" : "RANGE.MEDIUM",
    "long" : "RANGE.LONG"
}


WNG.traitDescriptions = {}

WNG.abilityTypeDescriptions = {}

WNG.rarity = {
  "common": "RARITY.COMMON",
  "uncommon": "RARITY.UNCOMMON",
  "rare": "RARITY.RARE",
  "very-rare": "RARITY.VERY_RARE",
  "unique": "RARITY.UNIQUE",
}

WNG.powerActivations = {
    free : "ACTIVATION.FREE",
    action : "ACTIVATION.ACTION",
    simple : "ACTIVATION.SIMPLE",
    full : "ACTIVATION.FULL",
    movement : "ACTIVATION.MOVEMENT"
}

WNG.abilityTypes = {
    battlecry : "ABILITY_TYPE.BATTLECRY",
    action : "ABILITY_TYPE.ACTION",
    ruin : "ABILITY_TYPE.RUIN",
    wrath : "ABILITY_TYPE.WRATH",
    complication : "ABILITY_TYPE.COMPLICATION",
    reaction : "ABILITY_TYPE.REACTION",
    determination : "ABILITY_TYPE.DETERMINATION",
    annihilation : "ABILITY_TYPE.ANNIHILATION"
}

WNG.abilityTypeAbbrev = {
    battlecry : "B",
    action : "A",
    ruin : "R",
    wrath : "W",
    complication : "C",
    reaction : "Re",
    determination : "D",
    annihilation : "An"
}

WNG.testTypes = {
    "attribute" : "Attribute",
    "skill" : "Skill",
    "resolve" : "Resolve",
    "corruption" : "Corruption"
}

WNG.resolveTests = {
    "fear" : "Fear",
    "terror" : "Terror"
}

WNG.convictionTests = {
    "corruption" : "Corruption",
    "mutation" : "Mutation"
}


WNG.rankTypes = {
    "none" : "RANK.NONE",
    "single" : "RANK.SINGLE",
    "double" : "RANK.DOUBLE"
}

WNG.difficultyRankTypes = {
    "none" :  "RANK.NONE",
    "minus-single" :  "RANK.MINUS_SINGLE",
    "minus-double" :  "RANK.MINUS_DOUBLE"
}

WNG.corruptionLevels = {
    0 : {level : "Pure", range : [0, 5], dn : 0},
    1 : {level : "Tarnished", range : [6, 11], dn : 1},
    2 : {level : "Contaminated", range : [11, 15], dn : 2},
    3 : {level : "Tainted", range : [16, 20], dn : 3},
    4 : {level : "Defiled", range : [21, 25], dn : 4},
    5 : {level : "Chaos Spawn", range : [26, 100], dn : 0}
}

WNG.attributeCosts = [0, 0, 4, 6, 10, 15, 20, 25, 30, 35, 40, 45, 50]

WNG.skillCosts = [0, 2, 4, 6, 8, 10, 12, 14, 16]


WNG.vehicleRoles = {
    "pilot" : "VEHICLRE.Pilot",
    "crew" : "VEHICLRE.Crew",
    "passenger" : "VEHICLRE.Passenger"
}


// mergeObject(scriptTriggers, {

//     equipToggle : "WH.Trigger.EquipToggle",

//     takeDamageMod : "WH.Trigger.TakeDamageMod",
//     applyDamageMod : "WH.Trigger.ApplyDamageMod",

//     preRollTest : "WH.Trigger.PreRollTest",
//     preRollCombatTest : "WH.Trigger.PreRollCombatTest",
//     preRollSpellTest : "WH.Trigger.PreRollSpellTest",

//     rollTest : "WH.Trigger.RollTest",
//     rollCombatTest : "WH.Trigger.RollCombatTest",
//     rollSpellTest : "WH.Trigger.RollSpellTest",
// }),

WNG.avoidTestTemplate = "systems/wrath-and-glory/template/apps/effect-avoid-test.hbs",
WNG.effectScripts = {},

WNG.logFormat = [`%cW & G` + `%c @MESSAGE`, "color: #DDD;background: #8a2e2a;font-weight:bold", "color: unset"],
WNG.rollClasses = {},

WNG.premiumModules = {
    "wrath-and-glory" : "Wrath & Glory System",
    "wng-core" : "Core Rulebook",
    "wng-forsaken" : "Forsaken System Player's Guide",
    "wng-litanies" : "Litanies of the Lost",
    "wng-records1" : "Redacted Records: Vol. I",
    "wng-cos" : "Church of Steel",
}

WNG.transferTypes = {
    document : "WH.TransferType.Document",
    damage : "WH.TransferType.Damage",
    target : "WH.TransferType.Target",
    area : "WH.TransferType.Area",
    aura : "WH.TransferType.Aura",
    other : "WH.TransferType.Other"
},

WNG.placeholderItemData = {
    type : "equipment",
    img : "modules/wng-core/assets/icons/equipment/equipment.webp"
},


WNG.systemEffects = {
    "wounded" : {
        id : "wounded",
        statuses : ["wounded"],
        name : "EFFECT.Wounded",
        img : "systems/wrath-and-glory/asset/icons/wounded.svg",
        changes : [
            {key: "difficulty.base", mode : 6, value : 1}
        ],
        flags : { 
            "wrath-and-glory.changeCondition" : { 
                0 : {description : "+1 DN to all Tests", script : "return true"}
            }
        }
    },
    "full-defence" : {
        id : "full-defence",
        statuses : ["full-defence"],
        name : "EFFECT.FullDefence",
        img : "systems/wrath-and-glory/asset/icons/full-defence.svg",
        changes : [
            {key: "system.combat.defence.bonus", mode : 2, value : 1},
        ],
    },
    "all-out-attack" : {
        id : "all-out-attack",
        statuses : ["all-out-attack"],
        name : "EFFECT.AllOutAttack",
        img : "systems/wrath-and-glory/asset/icons/all-out-attack.svg",
        changes : [
            {key: "pool.bonus", mode : 6, value : 2},
            {key: "system.combat.defence.bonus", mode : 2, value : -2},
        ],
        flags : { 
            "wrath-and-glory.changeCondition" : { 
                0 : {description : "+2 bonus dice to melee", script : "return data.weapon && data.weapon.isMelee"}
            }
        }
    },
    "halfCover" : {
        id : "halfCover",
        statuses : ["halfCover"],
        name : "EFFECT.HalfCover",
        img : "systems/wrath-and-glory/asset/icons/half-cover.svg",
        changes : [
            {key: "system.combat.defence.bonus", mode : 2, value : 1},
        ]
    },
    "fullCover" : {
        id : "fullCover",
        statuses : ["fullCover"],
        name : "EFFECT.FullCover",
        img : "systems/wrath-and-glory/asset/icons/full-cover.svg",
        changes : [
            {key: "system.combat.defence.bonus", mode : 2, value : 2},
        ]
    }
}


CONFIG.statusEffects = [
    {
        id : "bleeding",
        statuses : ["bleeding"],
        name : "CONDITION.Bleeding",
        img : "systems/wrath-and-glory/asset/icons/conditions/bleeding.svg",
    },
    {
        id : "blinded",
        statuses : ["blinded"],
        name : "CONDITION.Blinded",
        img : "systems/wrath-and-glory/asset/icons/conditions/blinded.svg",
        changes : [
            {key: "difficulty.base", mode : 6, value : 4}
        ],
        flags : { 
            "wrath-and-glory.changeCondition" : { 
                0 : {description : "Blinded", script : "return data.weapon"}
            }
        }
    },
    {
        id : "exhausted",
        statuses : ["exhausted"],
        name : "CONDITION.Exhausted",
        img : "systems/wrath-and-glory/asset/icons/conditions/exhausted.svg"
    },
    {
        id : "fear",
        statuses : ["fear"],
        name : "CONDITION.Fear",
        img : "systems/wrath-and-glory/asset/icons/conditions/fear.svg",
        changes : [
            {key: "difficulty.base", mode : 6, value : 2}
        ],
        flags : { 
            "wrath-and-glory.changeCondition" : { 
                0 : {description : "+2 DN to all Tests", script : "return true"}
            }
        }
    },
    {
        id : "frenzied",
        statuses : ["frenzied"],
        name : "CONDITION.Frenzied",
        img : "systems/wrath-and-glory/asset/icons/conditions/frenzied.svg",
        changes : [{key: "system.attributes.strength.bonus", mode : 2, value : 1}]
    },
    {
        id : "hindered",
        statuses : ["hindered"],
        name : "CONDITION.Hindered",
        img : "systems/wrath-and-glory/asset/icons/conditions/hindered.svg",
        changes : [
            {key: "difficulty.base", mode : 6, value : 1}
        ],
        flags : { 
            "wrath-and-glory.changeCondition" : { 
                0 : {description : "+DN to all Tests", script : "return true"}
            }
        }
    },
    {
        id : "onfire",
        statuses : ["onfire"],
        name : "CONDITION.OnFire",
        img : "systems/wrath-and-glory/asset/icons/conditions/onfire.svg"
    },
    {
        id : "pinned",
        statuses : ["pinned"],
        name : "CONDITION.Pinned",
        img : "systems/wrath-and-glory/asset/icons/conditions/pinned.svg",
        changes : [{key: "difficulty.base", mode : 6, value : 2}],
        flags : { 
            "wrath-and-glory.changeCondition" : { 
                0 : {description : "Pinned: Ballistic Skill Test Penalty", script : ""}
            }
        }
    },
    {
        id : "poisoned",
        statuses : ["poisoned"],
        name : "CONDITION.Poisoned",
        img : "systems/wrath-and-glory/asset/icons/conditions/poisoned.svg",
        changes : [{key: "difficulty.base", mode : 6, value : 2}],
        flags : { 
            "wrath-and-glory.changeCondition" : { 
                0 : {description : "+DN to all Tests", script : "return true"}
            }
        }
    },
    {
        id : "prone",
        statuses : ["prone"],
        name : "CONDITION.Prone",
        img : "systems/wrath-and-glory/asset/icons/conditions/prone.svg"
    },
    {
        id : "restrained",
        statuses : ["restrained"],
        name : "CONDITION.Restrained",
        img : "systems/wrath-and-glory/asset/icons/conditions/restrained.svg",
        changes : [{key: "system.combat.defence.bonus", mode : 2, value : -2},{key: "system.combat.speed", mode : 5, value : "0"} ]
    },
    {
        id : "staggered",
        statuses : ["staggered"],
        name : "CONDITION.Staggered",
        img : "systems/wrath-and-glory/asset/icons/conditions/staggered.svg",
        changes : [{key: "system.combat.speed", mode : 1, value : 0.5} ]
    },
    {
        id : "terror",
        statuses : ["terror"],
        name : "CONDITION.Terror",
        img : "systems/wrath-and-glory/asset/icons/conditions/terror.svg",
        changes : [{key: "difficulty.base", mode : 6, value : 2}],
        flags : { 
            "wrath-and-glory.changeCondition" : { 
                0 : {description : "+2 DN to all Tests", script : "return true"}
            }
        }
    },
    {
        id : "vulnerable",
        statuses : ["vulnerable"],
        name : "CONDITION.Vulnerable",
        img : "systems/wrath-and-glory/asset/icons/conditions/vulnerable.svg",
        changes : [{key: "system.combat.defence.bonus", mode : 2, value : -1}]
    },
    {
        id : "dying",
        statuses : ["dying"],
        name : "CONDITION.Dying",
        img : "systems/wrath-and-glory/asset/icons/dying.svg",
        system : {
            scriptData : [{
                label : "Extra Wrath Die",
                script : "args.fields.wrath++;",
                trigger : "dialog",
                options: {
                    activateScript : "return true;"
                }
            }]
        }
    },
    {
        id : "dead",
        statuses : ["dead"],
        name : "CONDITION.Dead",
        img : "systems/wrath-and-glory/asset/icons/dead.svg"
    }
    
]

CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.concat([
    {
        pattern : /@TableHTML\[(.+?)\](?:{(.+?)})?/gm,
        enricher : async (match) => 
        {
            let table = await fromUuid(match[1]);
            let options = match[2].split(",").map(i => i.trim());
            let label = options[0];
            if (table)
            {
                return $(await game.wng.utility.tableToHTML(table, label, options))[0];
            }
            else 
            {
                return `Error - Table ${match[0]} not Found`;
            }
        }
    }])

export default mergeObject(defaultWarhammerConfig, WNG);

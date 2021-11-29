

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
    "persusasion" : "SKILL.PERSUASION",
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
    "persusasion" : "fellowship",
    "pilot" : "agility",
    "psychicMastery" : "willpower",
    "scholar" : "intellect",
    "stealth" : "agility",
    "survival" : "willpower",
    "tech" : "intellect",
    "weaponSkill" : "initiative"
}


WNG.weaponTraits = {
    "agonising": "Agonising",
    "arc": "Arc",
    "assault": "Assault",
    "blast": "Blast",
    "brutal": "Brutal",
    "force": "Force",
    "flamer": "Flamer",
    "heavy": "Heavy",
    "inflict": "Inflict",
    "kustom": "Kustom",
    "melta": "Melta",
    "parry": "Parry",
    "pistol": "Pistol",
    "rad": "Rad",
    "rapidFire": "Rapid Fire",
    "reliable": "Reliable",
    "rending": "Rending",
    "silent": "Silent",
    "sniper": "Sniper",
    "spread": "Spread",
    "supercharge": "Supercharge",
    "unwieldy": "Unwieldy",
    "waaagh!": "Waaagh!",
    "warpWeapons": "Warp Weapon"
}

WNG.armourTraits = {
    "bulk": "Bulk",
    "cumbersome": "Cumbersome",
    "ereWeGo": "'Ere We Go!",
    "powerField": "Power Field",
    "powered": "Powered",
    "shield": "Shield"
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
    "shield": false
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


WNG.systemEffects = {
    "wounded" : {
        id : "wounded",
        label : "EFFECT.Wounded",
        icon : "systems/wrath-and-glory/asset/icons/wounded.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 1}],
        flags : { "wrath-and-glory.description" : "+1 DN to all Tests"}
    }
}


CONFIG.statusEffects = [
    {
        id : "bleeding",
        label : "CONDITION.Bleeding",
        icon : "systems/wrath-and-glory/asset/icons/conditions/bleeding.svg",
    },
    {
        id : "blinded",
        label : "CONDITION.Blinded",
        icon : "systems/wrath-and-glory/asset/icons/conditions/blinded.svg",
        changes : [
            {key: "difficulty.base", mode : 0, value : 4}],
        flags : { "wrath-and-glory.description" : "Increase DN for any sight-related task (including all combat Tests), replacing lesser penalties."}
    },
    {
        id : "exhausted",
        label : "CONDITION.Exhausted",
        icon : "systems/wrath-and-glory/asset/icons/conditions/exhausted.svg"
    },
    {
        id : "fear",
        label : "CONDITION.Fear",
        icon : "systems/wrath-and-glory/asset/icons/conditions/fear.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 2}],
        flags : { "wrath-and-glory.description" : "+2DN to all Tests"}
    },
    {
        id : "frenzied",
        label : "CONDITION.Frenzied",
        icon : "systems/wrath-and-glory/asset/icons/conditions/frenzied.svg",
        changes : [{key: "data.attributes.strength.bonus", mode : 2, value : 1}]
    },
    {
        id : "hindered",
        label : "CONDITION.Hindered",
        icon : "systems/wrath-and-glory/asset/icons/conditions/hindered.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 1}],
        flags : { "wrath-and-glory.description" : "+DN to all Tests"}
    },
    {
        id : "onfire",
        label : "CONDITION.OnFire",
        icon : "systems/wrath-and-glory/asset/icons/conditions/onfire.svg"
    },
    {
        id : "pinned",
        label : "CONDITION.Pinned",
        icon : "systems/wrath-and-glory/asset/icons/conditions/pinned.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 2}],
        flags : { "wrath-and-glory.description" : "Penalty to Ballistic Skill Tests when targeting an enemy using a Pinning Attacks against you"}
    },
    {
        id : "poisoned",
        label : "CONDITION.Poisoned",
        icon : "systems/wrath-and-glory/asset/icons/conditions/poisoned.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 2}],
        flags : { "wrath-and-glory.description" : "+DN to all Tests"}
    },
    {
        id : "prone",
        label : "CONDITION.Prone",
        icon : "systems/wrath-and-glory/asset/icons/conditions/prone.svg"
    },
    {
        id : "restrained",
        label : "CONDITION.Restrained",
        icon : "systems/wrath-and-glory/asset/icons/conditions/restrained.svg",
        changes : [{key: "data.combat.defense.bonus", mode : 2, value : -2},{key: "data.combat.speed", mode : 5, value : "0"} ]
    },
    {
        id : "staggered",
        label : "CONDITION.Staggered",
        icon : "systems/wrath-and-glory/asset/icons/conditions/staggered.svg",
        changes : [{key: "data.combat.speed", mode : 1, value : 0.5} ]
    },
    {
        id : "terror",
        label : "CONDITION.Terror",
        icon : "systems/wrath-and-glory/asset/icons/conditions/terror.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 2}],
        flags : { "wrath-and-glory.description" : "+2DN to all Tests"}
    },
    {
        id : "vulnerable",
        label : "CONDITION.Vulnerable",
        icon : "systems/wrath-and-glory/asset/icons/conditions/vulnerable.svg",
        changes : [{key: "data.combat.defense.bonus", mode : 2, value : -1}]
    }
]

export default WNG



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

WNG.rarity = {
  "common": "Common",
  "uncommon": "Uncommon",
  "rare": "Rare",
  "very-rare": "Very Rare",
  "unique": "Unique",
}

WNG.abilityTypes = {
    battlecry : "BATTLECRY",
    action : "ACTION",
    ruin : "RUIN",
    wrath : "WRATH",
    complication : "COMPLICATION",
    reaction : "REACTION",
    determination : "DETERMINATION",
    annihilation : "ANNIHILATION"
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

WNG.attributeCosts = [0, 0, 4, 6, 10, 15, 20, 25, 30, 35, 40, 45, 50]

WNG.skillCosts = [0, 2, 4, 6, 8, 10, 12, 14, 16]



CONFIG.statusEffects = [
    {
        id : "bleeding",
        label : "Bleeding",
        icon : "systems/wrath-and-glory/asset/icons/conditions/bleeding.svg",
    },
    {
        id : "blinded",
        label : "Blinded",
        icon : "systems/wrath-and-glory/asset/icons/conditions/blinded.svg",
        changes : [
            {key: "difficulty.base", mode : 0, value : 4}],
        flags : { "wrath-and-glory.description" : "Increase DN for any sight-related task (including alal combat Tests), replacing lesser penalties."}
    },
    {
        id : "exhausted",
        label : "Exhausted",
        icon : "systems/wrath-and-glory/asset/icons/conditions/exhausted.svg"
    },
    {
        id : "fear",
        label : "Fear",
        icon : "systems/wrath-and-glory/asset/icons/conditions/fear.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 2}],
        flags : { "wrath-and-glory.description" : "+2DN to all Tests"}
    },
    {
        id : "frenzied",
        label : "Frenzied",
        icon : "systems/wrath-and-glory/asset/icons/conditions/frenzied.svg",
        changes : [{key: "data.attributes.strength.bonus", mode : 2, value : 1}]
    },
    {
        id : "hindered",
        label : "Hindered",
        icon : "systems/wrath-and-glory/asset/icons/conditions/hindered.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 1}],
        flags : { "wrath-and-glory.description" : "+DN to all Tests"}
    },
    {
        id : "onfire",
        label : "On Fire",
        icon : "systems/wrath-and-glory/asset/icons/conditions/onfire.svg"
    },
    {
        id : "pinned",
        label : "Pinned",
        icon : "systems/wrath-and-glory/asset/icons/conditions/pinned.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 2}],
        flags : { "wrath-and-glory.description" : "Penalty to Ballistic Skill Tests when targeting an enemy using a Pinning Attacks against you"}
    },
    {
        id : "poisoned",
        label : "Poisoned",
        icon : "systems/wrath-and-glory/asset/icons/conditions/poisoned.svg",
        changes : [{key: "difficulty.base", mode : 0, value : 2}],
        flags : { "wrath-and-glory.description" : "+DN to all Tests"}
    },
    {
        id : "prone",
        label : "Prone",
        icon : "systems/wrath-and-glory/asset/icons/conditions/prone.svg"
    },
    {
        id : "restrained",
        label : "Restrained",
        icon : "systems/wrath-and-glory/asset/icons/conditions/restrained.svg",
        changes : [{key: "data.combat.defense.bonus", mode : 2, value : -2},{key: "data.combat.speed", mode : 5, value : "0"} ]
    },
    {
        id : "staggered",
        label : "Staggered",
        icon : "systems/wrath-and-glory/asset/icons/conditions/staggered.svg",
        changes : [{key: "data.combat.speed", mode : 1, value : 0.5} ]
    },
    {
        id : "terror",
        label : "Terror",
        icon : "systems/wrath-and-glory/asset/icons/conditions/terror.svg"
    },
    {
        id : "vulnerable",
        label : "Vulnerable",
        icon : "systems/wrath-and-glory/asset/icons/conditions/vulnerable.svg",
        changes : [{key: "data.combat.defense.bonus", mode : 2, value : -1}]
    }
]

export default WNG

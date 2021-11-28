

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


WNG.traitDescriptions = {
    "agonising": "<p>Designed to inflict maximum pain, these weapons damage mind and morale as much as body.&nbsp;</p><p>Every Wound inflicted by an Agonising weapon also inflicts 1 Shock.&nbsp;</p>",
    "arc": "<p>The deadly electrical discharge of Arc weapons scrambles vehicle technology.&nbsp;</p><p>Arc weapons gain +ED equal to their rating when you use them to attack a vehicle.&nbsp;</p>",
    "assault": "<p>Optimised for firing whilst rushing righteously towards the enemy.</p><p>You can fire an Assault weapon as part of a Sprint (p.180), but take a +2 DN penalty to the attack.&nbsp;</p>",
    "blast": "<p>Explosive weapons can devastate multiple enemies with a single attack.&nbsp;</p><p>When you fire or throw a Blast weapon, choose any point in range (including another character!), then make a DN 3 Ballistic Skill (A) Test. Apply Range effects as normal (p.184) unless you are using a thrown weapon like a grenade. If you fail the Test, the attack misses and Scatters (p,186). If you succeed, the explosion is centered on your target.&nbsp;</p><p>If you are measuring distance, the Blast rating determines the radius of the explosion in metres. Anyone inside this radius is hit by the attack.&nbsp;</p><p>If you are targeting a Mob or using a simplified theater of the mind approach, the number of nearby individuals hit by the explosive is equal to half the Blast rating.&nbsp;</p><p>&nbsp;You cannot Shift to increase the damage of a Blast weapon. If you inflict a Critical Hit with a Blast weapon, the effects apply to all targets hit by the attack.</p>",
    "brutal": "<p>Brutal weapons inflict appalling, traumatic wounds.</p><p>When you roll Extra Damage Dice for a Brutal weapon:</p><ul><li>Results of 1 and 2 inflict 0 Damage.</li><li>Results of 3 and 4 inflict 1 Damage.</li><li>Results of 5 and 6 inflict 2 Damage.</li></ul>",
    "force": "<p>Psykers can channel the power of the Warp through the etheric circuit patterns and psycho-reactive materials of these weapons.&nbsp;</p><p>If you have the PSYKER Keyword, you may add half of your (Wil) Rating to a Force weapon&rsquo;s Damage Value. If you don&rsquo;t have the PSYKER Keyword, a Force weapon&rsquo;s damage is decreased by 2.</p>",
    "flamer": "<p>Flamers spew a stream of burning chemical liquid. The flowing torrent of flame can be guided by the wielder of a Flamer to set multiple foes ablaze.&nbsp;</p><p>Attacks made with a Flamer ignore cover. If you hit a target with a Flamer, blazing liquid fills the space between you and your target in a straight line. Anything in that line is also hit by the attack.&nbsp;</p><p>You can Shift when you make a ranged attack Test with a Flamer to arc the stream of burning chemicals a number of metres equal to your Ballistic Skill Rating. Anything in this arc is hit by the attack.&nbsp;</p><p>Whenever you hit multiple targets, roll damage once and apply that damage to all targets. Any target may attempt to reduce the damage using the rules for Dodging Area Effect Attacks on p.186.</p><p>A weapon with the Flamer Trait is considered to have the Inflict (On Fire) Trait.&nbsp;</p>",
    "heavy": "<p>Large and cumbersome weapons are difficult to wield accurately and effectively.&nbsp;</p><p>You must have a Strength equal to the Heavy weapon&rsquo;s rating to fire it normally. All attacks with a Heavy weapon are made with a +2 DN penalty if you do not meet the minimum Strength, and rolling a Complication as part of an attack knocks you Prone in addition to any other effects.&nbsp;</p><p>Taking the @JournalEntry[UvKsuiw9Sy0mVk25]{Brace} Action or securing a Heavy weapon to something like a tripod negates the Heavy Trait.&nbsp;</p>",
    "inflict": "<p>These weapons are designed to harm the target in cruel and unusual ways.&nbsp;</p><p>Every Inflict weapon has a Condition that it imposes on the target if it deals a Wound. For example, if a weapon with Inflict (On Fire) deals a Wound to a target, the target is On Fire.&nbsp; &nbsp; &nbsp;</p><p>If an Inflict weapon has a number, that number determines the number of any Test made to remove the Condition. For example, if a weapon with Inflict (Poisoned 4) Wounds a target, they are Poisoned, and the target would need to make a DN 4 Toughness Test to recover at the beginning of their next turn.&nbsp;</p>",
    "kustom": "<p>You can replace this weapon Trait with any other Weapon Trait of your choice when you acquire a weapon with this Trait. If the Trait you select has a Rating (X), roll [[/r 1d3]] to determine the Rating.&nbsp;</p>",
    "melta": "<p>The sub-atomic bursts that spew from these weapons melt flesh and reduce armour to slag.&nbsp;</p><p>When you roll Extra Damage Dice for a Melta weapon fired at Short Range:</p><ul><li>Results of 1 and 2 inflict 0 Damage.</li><li>Results of 3 and 4 inflict 1 Damage.</li><li>Results of 5 and 6 inflict 2 Damage.</li></ul><p>When you roll Extra Damage Dice for a Melta weapon fired against a vehicle or fortification at Short range:</p><ul><li>Results of 1, 2 and 3 inflict 1 Damage.</li><li>Results of 4, 5 and 6 inflict 2 Damage.</li></ul>",
    "parry": "<p>You can use these weapons to deflect blows.&nbsp;</p><p>You gain +1 Defence against melee attacks while wielding a Parry weapon.</p>",
    "pistol": "<p>Built light to be drawn quickly and used in close quarters.&nbsp;</p><p>Pistols can be fired while @JournalEntry[UvKsuiw9Sy0mVk25]{Engaged}.&nbsp;</p>",
    "rad": "<p>The dangerous radioactive materials fired by these weapons irrevocably damage flesh.&nbsp;</p><p>When you roll Extra Damage Dice for a Rad weapon, you add the Rating to the results of the dice.&nbsp;</p><p><strong>Example</strong>: <em>Sara fires a Radium Pistol at a Combat Servitor. She hits, and Shifts an Exalted Icon for an additional Extra Damage Die. She rolls the 2 ED with the following results: 2, 4. Just one Icon, so one extra Damage.&nbsp;</em></p><p><em>Because the Radium Pistol is Rad (2), she adds 2 to the result of each ED, meaning her final results are: 4, 6. An Icon and an Exalted Icon for 3 extra Damage!&nbsp;</em></p>",
    "rapidFire": "<p>These weapons are capable of quickly unleashing a hail of death at close range.&nbsp;</p><p>If you hit with a Rapid Fire weapon at Short Range, you gain Extra Damage Dice equal to the weapon&rsquo;s Rapid Fire rating.&nbsp;</p>",
    "reliable": "<p>A rugged and easily maintained weapon.</p><p>You can ignore the first Complication related to this weapon per scene. Tests made to repair or maintain Reliable weapons are made with +1 bonus die.</p>",
    "rending": "<p>These powerful weapons punch through armour.&nbsp;</p><p>When you Shift an Exalted Icon as part of an attack with a Rending weapon, the weapon&rsquo;s AP improves by the Rending rating for that attack.&nbsp;</p><p><strong>Example</strong>: <em>Fian fires his Shuriken Pistol at a Genestealer. Normally, a Shuriken Pistol has AP 0. Fian&rsquo;s shot hits, and he Shifts an Exalted Icon for an additional Extra Damage Die. Because he Shifted an Exalted Icon, the Shuriken Pistol&rsquo;s Rending (3) activates, meaning that for this attack the pistol has AP -3!&nbsp;</em></p>",
    "silent": "<p>These stealthy weapons are designed to deal damage as quietly as possible.&nbsp;</p><p>When a weapon with this Trait is used as part&nbsp;</p><p>of an attack, your Stealth Score is only reduced by 2.</p>",
    "sniper": "<p>Weapons optimised for high accuracy over long range.&nbsp;</p><p>When you Aim with a Sniper weapon you gain an additional + 1 bonus die to the attack, and gain +ED equal to the weapon&rsquo;s Sniper rating.&nbsp;</p>",
    "spread": "<p>These wide-bore weapons wreak havoc on closely packed combatants.&nbsp;</p><p>When fired at Short Range, a Spread weapon can hit any number of targets as long as they are all within 3 metres of one another. When you fire a Spread Weapon at a Mob you gain +3 bonus dice.&nbsp;</p><p><strong>Example</strong>: <em>Kira aims her Shotgun, waiting for the two Khornate Cultists charging her to get into Short Range. She fires, and as the two Cultists were close together and her weapon has Spread, the GM rules that both of them are hit by the wide blast of shot.&nbsp;</em></p><p><em>Enemies in a Mob are assumed to be close together; if the Khornate Cultists had been in a Mob, Kira would have gained +Rank bonus dice, potentially hitting more targets.&nbsp;&nbsp;</em></p>",
    "supercharge": "<p>The super-heated matter plasma weapons fire can be overcharged with undeniably deadly results for the target and, occasionally, the wielder.&nbsp;</p><p>You can choose to fire a weapon with this Trait in Supercharge mode. If you roll a Complication, you take [[/r 1d6]] Mortal Wounds. If you hit, the weapon deals an additional +3 ED.&nbsp;</p>",
    "unwieldy": "<p>Whether unbalanced or too large, some weapons are harder to use.&nbsp;&nbsp;</p><p>Attacks made with Unwieldy weapons have their DN increased by an amount equal to their Unwieldy rating.&nbsp;</p>",
    "waaagh!": "<p>Ork weapons defy understanding; they break the laws of mechanics and physics, but a Greenskin&rsquo;s beliefs make them all the more deadly.&nbsp;</p><p>If you are an Ork, you gain +1 bonus die to attacks with a WAAAGH! weapon. If you are also @JournalEntry[UbwRlh8yLbCVJYwy]{Wounded}, you deal an extra +1 ED.&nbsp;</p>",
    "warpWeapons": "<p>Powered by psychic energy, xenos technology, or the raw force of Chaos, few can face these ungodly weapons and emerge unharmed.&nbsp;</p><p>A Warp Weapon has a Damage value equal to the target&rsquo;s Total Resilience &ndash;4, unless the weapon&rsquo;s listed Damage is higher.&nbsp;</p>",
    "bulk": "<p>Heavy and restrictive armour possesses the Bulk trait.&nbsp;</p><p>Bulk reduces the Speed of the wearer by a number of metres equal to its rating.</p>",
    "cumbersome": "<p>Large suits of armour can severely restrict movement.&nbsp;</p><p>You cannot Run or Sprint in Cumbersome armour.&nbsp;</p>",
    "ereWeGo": "<p>The latent psychic power of an Ork empowers their armour, allowing them to fight harder when harmed.&nbsp;</p><p>An Ork wearing armour with this Trait ignores&nbsp;</p><p>the Bulk and Cumbersome Traits when Wounded.&nbsp;</p>",
    "powerField": "<p>Wonders of archeotech, personal Power Fields envelope their user in a protective barrier of energy.&nbsp;</p><p>Armour with this Trait allows you to roll Determination against attacks that deal Mortal Wounds.&nbsp;</p>",
    "powered": "<p>This armour is designed to augment the wearer&rsquo;s might through the marvels of mechanisation.&nbsp;</p><p>Whilst wearing armour with this Trait you gain a Strength bonus equal to the rating. Additionally, you are not knocked Prone when you roll a Complication while firing an unsecured Heavy weapon.&nbsp;</p>",
    "shield": "<p>Wielded like a defensive weapon, shields are carried instead of worn, and used to deflect incoming attacks.&nbsp;</p><p>Armour with this Trait adds its AR to your Defence and Resilience, provided the GM agrees you can manoeuvre the shield to block the attack.</p>",
}

WNG.abilityTypeDescriptions = {
    battlecry : "Battlecry: A Free Action ability that activates at the start of combat, or when the Threat takes its first turn. These abilities only activate once.",
    action : "Action: A list of Combat Actions the Threat can take. RUIN: Any Ruin Actions the Threat can take.",
    wrath: "Wrath: Any special rules that activate when the Threat rolls a Wrath Critical.",
    complication : "Complication: Any special rules that activate when the Threat rolls a Complication.",
    reaction : "Reaction: Any Reflexive Actions the Threat can take, and what triggers them.",
    determination : "Determination: Any requirements for the Threat to roll Determination, as well as their dice pool.",
    annihilation : "Annihilation: An ability that activates when the Threat dies or is Dying.",
}

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

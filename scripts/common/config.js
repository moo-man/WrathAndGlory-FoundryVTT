

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


WNG.scriptTriggers = {

    equipToggle : "WH.Trigger.EquipToggle",

    preRollTest : "WH.Trigger.preRollTest",
    rollTest : "WH.Trigger.rollTest",

    preRollWeaponTest : "WH.Trigger.preRollWeaponTest",
    rollWeaponTest : "WH.Trigger.rollWeaponTest",
    
    computeDamage : "WH.Trigger.computeDamage",
    preComputeDamage : "WH.Trigger.preComputeDamage",

    preTakeDamage : "WH.Trigger.preTakeDamage",
    preApplyDamage : "WH.Trigger.preApplyDamage",

    takeDamage : "WH.Trigger.takeDamage",
    applyDamage : "WH.Trigger.applyDamage",
    
}

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
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "args.fields.difficulty += 1",
                label : "+1 DN to all Tests",
                options : {
                    activateScript : "return true;",
                }
            }]
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
            {key: "system.combat.defence.bonus", mode : 2, value : -2},
        ],
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "args.fields.pool += 2",
                label : "+2 bonus dice for Melee attacks",
                options : {
                    hideScript : "return !args.weapon || args.weapon.isRanged",
                    activateScript : "return args.weapon.isMelee;",
                }
            }]
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
    },
    "unbound" : {
        id : "unbound",
        statuses : ["unbound"],
        name : "PSYCHIC_POWER.UNBOUND",
        img : "systems/wrath-and-glory/asset/icons/wounded.svg",
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "if (args.fields.level == 'bound') args.fields.level = 'unbound'",
                label : "Unbound",
                options : {
                    hideScript : "return !args.power",
                    activateScript : "return true;",
                }
            }]
        }
    },
    "transcendent" : {
        id : "transcendent",
        statuses : ["transcendent"],
        name : "PSYCHIC_POWER.TRANSCENDENT",
        img : "systems/wrath-and-glory/asset/icons/wounded.svg",
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "if (args.fields.level == 'bound' || args.fields.level == 'unbound') args.fields.level = 'transcendent'",
                label : "Transcendent",
                options : {
                    hideScript : "return !args.power",
                    activateScript : "return true;",
                }
            }]
        }
    },
}

WNG.traitEffects = {
         // Qualities
         agonising: {
            name : "TRAIT.Agonising",
            system : {
                transferData : {
                    documentType : "Item"
                },
                scriptData : [{
                    label : "Agonising",
                    trigger : "preApplyDamage",
                    script : "TODO: Add wounds to shock",
                },
            ],
            }
        },
        arc: {
            name : "TRAIT.Arc",
            system : {
                transferData : {
                    documentType : "Item"
                },
                scriptData : [{
                    label : "Attacking a Vehicle",
                    trigger : "dialog",
                    script : "args.fields.ed.value += parseInt(this.item.traitList.arc.rating)",
                    options : {
                        hideScript : "return args.target && args.target.type != 'vehicle'",
                        activateScript : "return args.target?.type == 'vehicle'",
                    }
                },
            ],
            }
        },
        assault: {
            name : "TRAIT.Assault",
            system : {
                transferData : {
                    documentType : "Item"
                },
                scriptData : [{
                    label : "Attacking while Sprinting",
                    trigger : "dialog",
                    script : "args.fields.difficulty += 2"
                },
            ],
            }
        },
        brutal: {
            name : "TRAIT.Brutal",
            system : {
                transferData : {
                    documentType : "Item"
                },
                scriptData : [{
                    label : "Brutal",
                    trigger : "dialog",
                    script : "args.fields.damageDice.values.threes += 1; args.fields.damageDice.values.fives += 1;",
                    options : {
                        activateScript: "return true;"
                    }
                },
            ],
            }
        },
        force: {
            name : "TRAIT.Force",
            system : {
                transferData : {
                    documentType : "Item"
                },
                scriptData : [{
                    label : "Force Weapon",
                    trigger : "dialog",
                    script : "args.fields.damage += Math.ceil(args.actor.system.attributes.willpower.total / 2)",
                    options : {
                        hideScript : "return !args.actor.hasKeyword('PSYKER');",
                        activateScript: "return args.actor.hasKeyword('PSYKER');"
                    }
                },
                {
                    label : "Force Weapon (Not a Psyker)",
                    trigger : "dialog",
                    script : "args.fields.damage -= 2",
                    options : {
                        hideScript : "return args.actor.hasKeyword('PSYKER');",
                        activateScript: "return !args.actor.hasKeyword('PSYKER');"
                    }
                }
            ],
            }
        },
        flamer: {
            name : "TRAIT.Flamer",
            system : {
                transferData : {
                    documentType : "Item"
                },
                scriptData : [
                {
                    label : "On Fire",
                    trigger : "applyDamage",
                    script : "TODO: Add on fire condition",
                }
            ],
            }
        },
        heavy: {
            name : "TRAIT.Heavy",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Entangle",
                    trigger : "dialog",
                    script : "args.fields.difficulty += 2;",
                    options : {
                        // TODO add prone?
                        hideScript : "return args.actor.system.attributes.strength.total >= this.item.traitList.heavy.value",
                        activateScript : "return args.actor.system.attributes.strength.total < this.item.traitList.heavy.value"
                    }
                }]
            }

        },
        inflict: {
            name : "TRAIT.Inflict",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Inflict Condition",
                    trigger : "applyDamage",
                    script : "TODO",
                }]
            }
        },
        kustom: {
            name : "TRAIT.Kustom",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Select Trait",
                    trigger : "manual",
                    script : "[Script.mo3XmOzgaROpB97i]"
                }]
            }
        },
        melta: {
            name : "TRAIT.Melta",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Melta - Short Range",
                    trigger : "dialog",
                    script : "args.fields.damageDice.values.threes += 1; args.fields.damageDice.values.fives += 1;",
                    options : {
                        hideScript : "return args.target && args.target.type != 'vehicle'",
                        activateScript : "return args.target?.type != 'vehicle'",
                    }
                },
                {
                    label : "Melta - Short Range (Vehicle)",
                    trigger : "dialog",
                    script : "args.fields.damageDice.values.ones += 1; args.fields.damageDice.values.twos += 1; args.fields.damageDice.values.threes += 1;   args.fields.damageDice.values.fours += 1; args.fields.damageDice.values.fives += 1;",
                    options : {
                        hideScript : "return args.target && args.target.type == 'vehicle'",
                        activateScript : "return args.target?.type == 'vehicle'",
                    }
                }
            ],
            }
        },
        parry: {
            name : "TRAIT.Parry",
            system : {
                transferData : {
                    documentType : "Actor",
                    equipTransfer: true
                },
                scriptData : [{
                    label : "Parry",
                    trigger : "dialog",
                    script : "args.fields.difficulty += 1",
                    options : {
                        targeter: true,
                        hideScript : "return !this.weapon || this.weapon?.isRanged",
                        activateScript : "return this.weapon?.isMelee",
                    }
                }]
            }
        },
        pistol : {
            name : "TRAIT.Pistol",
            system : {
                transferData : {
                    documentType : "Item",
                },
            }
        },
        rad: {
            name : "TRAIT.Rad",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Rad",
                    trigger : "dialog",
                    script : "args.fields.damageDice.addValue += parseInt(this.item.traitList.rad.rating)",
                    options : {
                        activateScript : "return true;",
                    }
                }]
            }
        },
        rapidFire: {
            name : "TRAIT.RapidFire",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Rapid Fire - Short Range",
                    trigger : "dialog",
                    script : "args.fields.ed.value += (parseInt(this.item.traitList.rapidFire.rating) || 0)",
                    options : {
                        activateScript : "return this.fields.range == 'short'",
                    }
                }]
            }
        },
        reliable: {
            name : "TRAIT.Reliable",
            system : {
                transferData : {
                    documentType : "Item"
                }
            }
        },
        rending: {
            name : "TRAIT.Rending",
            system : {
                transferData : {
                    documentType : "Item",
                },
                // TODO
            }
        },
        silent: {
            name : "TRAIT.Silent",
            system : {
                transferData : {
                    documentType : "Item",
                },
            }
        },
        sniper: {
            name : "TRAIT.Sniper",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Sniper - Aim",
                    trigger : "dialog",
                    script : "args.fields.pool += 1; args.fields.ed.value += (parseInt(this.item.traitList.sniper.rating) || 0);",
                    options : {
                        activateScript : "return this.fields.aim",
                    }
                }]
            }
        },
        spread: {
            name : "TRAIT.Spread",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Spread - Mob",
                    trigger : "dialog",
                    script : "args.fields.pool += 3;",
                    options : {
                        activateScript : "return args.target?.isMob",
                    }
                }]
            }
        },
        supercharge: {
            name : "TRAIT.Supercharge",
            system : {
                transferData : {
                    documentType : "Item",
                },
                //TODO
            }
        },
        unwieldy: {
            name : "TRAIT.Unwieldy",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Unwieldy",
                    trigger : "dialog",
                    script : "args.fields.difficulty += parseInt(this.item.traitList.unwieldy.rating);",
                    options : {
                        activateScript : "return true;",
                    }
                }]
            }
        },
        "waaagh!": {
            name : "TRAIT.Waaagh",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Unwieldy",
                    trigger : "dialog",
                    script : "args.fields.pool++; if (args.actor.statuses.has('wounded')) args.fields.ed.value++;",
                    options : {
                        activateScript : "return args.actor.hasKeyword('ORK');",
                    }
                }]
            }
        },
        warpWeapons: {
            name : "TRAIT.WarpWeapon",
            system : {
                transferData : {
                    documentType : "Item",
                },
                scriptData : [{
                    label : "Warp Weapon",
                    trigger : "dialog",
                    script : "this.fields.damage = args.target.system.combat.resilience.total - 4;",
                    options : {
                        hideScript : "return !args.target;",
                        activateScript : "return this.item.system.damage.base < (args.target.system.combat.resilience.total - 4);",
                    }
                }]
            }
        }   ,
        bulk: {
            name : "TRAIT.Bulk",
            system : {
                transferData : {
                    equipTransfer: true
                },
                scriptData : [{
                    label : "Reduce Speed",
                    trigger : "prePrepareData",
                    script : "this.actor.system.combat.speed -= this.item.itemTraits.bulk.rating",
                }]
            }
        },
        powered: {
            name : "TRAIT.Powered",
            system : {
                transferData : {
                    equipTransfer: true
                },
                scriptData : [{
                    label : "Increase Strength",
                    trigger : "computeCombat",
                    script : "this.actor.system.attributes.strength.total -= this.item.itemTraits.bulk.rating",
                }]
            }
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
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "args.fields.difficulty += 4",
                label : "Sight Related",
                options : {
                    activateScript : "return ['weaponSkill', 'ballisticSkill', 'psychicMastery'].includes(args.skill)"
                }
            }]
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
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "args.fields.difficulty += 2",
                label : "+2 DN to all Tests",
                options : {
                    activateScript : "return true;"
                }
            }]
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
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "args.fields.difficulty += 1",
                label : "+1 DN to all Tests",
                options : {
                    activateScript : "return true;"
                }
            }]
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
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "args.fields.difficulty += 2",
                label : "+2 DN to Ballistic Skill Tests",
                options : {
                    activateScript : "return args.attribute == 'ballisticSkill';",
                    hideScript : "return args.attribute != 'ballisticSkill';"
                }
            }]
        }
    },
    {
        id : "poisoned",
        statuses : ["poisoned"],
        name : "CONDITION.Poisoned",
        img : "systems/wrath-and-glory/asset/icons/conditions/poisoned.svg",
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "args.fields.difficulty += 2",
                label : "+2 DN to all Tests",
                options : {
                    activateScript : "return true",
                }
            }]
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
        system : {
            scriptData : [{
                trigger : "dialog",
                script : "args.fields.difficulty += 2",
                label : "+2 DN to all Tests",
                options : {
                    activateScript : "return true",
                }
            }]
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

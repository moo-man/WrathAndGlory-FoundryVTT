---
layout: default
title: Dialog
parent: Scripts
nav_order: 2
grand_parent: Active Effects
---

Dialog scripts show up within the **Dialog Modifiers** section in roll dialog windows, and are able to be toggled on or off, causing some sort of behavior. They are probably the most powerful type of script, especially when used in conjunction with other scripts. They are unique in that they have their main script, which is generally used to modify the dialog fields (adding to modifier, SL bonus, etc.), but they also have 3 subscripts, described below. 

- Hide Script: Returning true with this script hides the option from selection, taking precedent over Activate Script

- Activate Script: Returning true with this script results in this modifier being automatically activated in the dialog window (as opposed to manually clicking on the option)

- Submission Script: This script runs when this script is *activated* and the dialog is submitted. Usually this is for setting some special flag for another script to use. See the examples below. 


## Key

`dialog`

## Arguments 

The `args` parameter corresponds the dialog application itself. which has some useful properties. 

`args.actor` - Actor performing the test (important distinction to `this.actor` because of the targeter option (see **Special Features**))

`args.attribute` - The Attribute being used for the roll ("strength" or "fellowship")

`args.skill` - If a skill is being used, it is available here ("weaponSkill" or "pilot")

`args.weapon` - The weapon used, if available

`args.power` - The psychic power used, if available

`args.fields` - Specifically the editable properties (fields) in the dialog window

`args.fields` - Object of all the "fields" in the dialog

&emsp;`fields.pool` - Amount of dice rolled

&emsp;`fields.wrath` - How many *of the pool dice* are wrath dice

&emsp;`fields.difficulty` - The DN value

&emsp;`fields.damage` - Base damage value

&emsp;`fields.ap.value` - AP value

&emsp;`fields.ap.value` - AP value

&emsp;`fields.range` - Range, e.g. "long"  or "short" 

&emsp;`fields.level` - Psychic power manifestation level, "bound", "unbound" ,r "transcedent"

&emsp;`fields.agm` - The Aim checkbox

&emsp;`fields.damageDice.ones/twos/threes/fours/fives/sixes` - Damage values for ED results

&emsp;`fields.damageDice.addValue` - Added value to base ED roll 

`args.flags` - An object that is intended to freely be used by scripts, it is useful to prevent duplicate executions, such as for Talents that have been taken multiple times but should only execute once. 

There are a plethora of other properties available to look at, you can use the console command `ui.activeWindow` with a dialog in focus to see everything available.

## Special Features

With `Targeter` selected, a dialog effect is designated not to apply to yourself, but to anyone who targets you and opens a dialog. This is useful for effects that increase or decrease your defensive situation, such as "Disadvantage to anyone attacking you with a ranged weapon."

## Examples

### Bonus Dice

**Usage**: Add bonus dice to all Fellowship based tests

#### Hide
```js
return args.attribute != "fellowship"
```

#### Activate
```js
return args.attribute == "fellowship"
```

#### Script
```js
args.fields.pool += 1;
```

**Notes**: We hide the option if the attribute isn't fellowship, and we activate it if the attribute is fellwoship. Once activated, it adds 1 to the die pool field

---
### Add Stealth value to ED

**Usage**: An ability that increases damage (adding ED) based on Actor's stealth score

#### Hide
```js
return return !args.weapon || !args.actor.system.combat.stealth
```

#### Activate
```js
return return args.weapon && args.actor.system.combat.stealth
 ```

#### Script
```js
args.fields.ed.value += args.actor.system.combat.stealth
```

---
### Add Rank to Dice Pool

**Usage**: Adds double rank to dice pool if aiming

#### Hide
```js
return !args.fields.aim
```

#### Activate
```js
return args.fields.aim
```

#### Script
```js
args.fields.pool += (args.actor.system.advances.rank * 2)
```

---
### Add Wrath Dice

**Usage**: Adds additional wrath dice to Psychic Mastery tests

#### Hide
```js
return args.skill != "psychicMastery"
```

#### Activate
```js
return !args.skill == "psychicMastery"
```

#### Script
```js
args.fields.wrath += 2
args.fields.pool += 2
```

**Notes**: Add both Pool and Wrath dice, because the Wrath fields only dictates how many of the pool dice are wrath dice, so just adding Wrath dice adds no additional dice inherently. 

Additionally, there is no need to test for `args.power` because we know all Psychic Powers use `psychicMastery` skill.

---

### Submission Script Example

**Usage**: Disables an effect after it's been "used" in the dialog

#### Hide
```js
// No Hide script
```

#### Activate
```js
// No Activate script, this should be manually activated
```

#### Submission
```js
this.effect.update({disabled : true})
```

#### Script
```js
    args.fields.pool++;
```

**Notes** This disables the effect when the user clicks on the modifier in the dialog, granting them advantage. The effect can then be re-enabled manually whenever it can be used again.

export default function() {
    Hooks.on("getChatLogEntryContext", (html, options) => {
        let canApply = li => li.find(".damageRoll").length && game.user.targets.size > 0;
        options.push(
            {
                name: "Apply Damage",
                icon: '<i class="fas fa-user-minus"></i>',
                condition: canApply,
                callback: li => {
                    let rollData = game.messages.get(li.attr("data-message-id")).data.flags.rolldata;
                    game.user.targets.forEach(t => _dealDamageToTarget(rollData, t.actor));
                }
            },
            {
                name: "Apply Damage (Invulnerable armour)",
                icon: '<i class="fas fa-user"></i>',
                condition: canApply,
                callback: li => {
                    let rollData = game.messages.get(li.attr("data-message-id")).data.flags.rolldata;
                    game.user.targets.forEach(t => _dealDamageToTarget(rollData, t.actor, false));
                }
            },
            {
                name: "Apply Damage (AP only on Armour)",
                icon: '<i class="fas fa-user-times"></i>',
                condition: canApply,
                callback: li => {
                    let rollData = game.messages.get(li.attr("data-message-id")).data.flags.rolldata;
                    game.user.targets.forEach(t => _dealDamageToTarget(rollData, t.actor, true, true));
                }
            }

        )
    });
}

function _dealDamageToTarget(rollData, target, useAP = true, optionalRule = false) {
    let resilence = 1;
    if (!useAP) {
        resilence = target.combat.resilence.total + _computeArmour(target);
    }

    if (useAP && !optionalRule) {
        resilence = (target.combat.resilence.total + _computeArmour(target)) - rollData.weapon.ap.total;
    }

    if (useAP && optionalRule) {
        let armour = _computeArmour(target) - rollData.weapon.ap.total;
        if (0 > armour) {
            armour = 0;
        }
        resilence = (target.combat.resilence.total + armour);
    }

    if (0 >= resilence) {
        resilence = 1;
    }

    let dmgTaken = rollData.result.damage.total - resilence;
    if (0 > dmgTaken) {
        return;
    }

    if (0 === dmgTaken) {
        target.update({
            "data.combat.shock.value" : target.combat.shock.value + 1,
        });
    }

    if (0 < dmgTaken) {
        target.update({
            "data.combat.wounds.value" : target.combat.wounds.value + dmgTaken
        });
    }
}

function _computeArmour(actor) {
    let foundItems = actor.data.items.filter(a => a.data.type === "armour");
    let armourRating = 0;
    for (let armour of foundItems) {
        armourRating += armour.rating;
    }
    return armourRating;
}

export default function() {
    Hooks.on("getChatLogEntryContext", (html, options) => {
        let canApply = li => li.find(".damageRoll").length && canvas.tokens.controlled.length > 0;
        options.unshift(
            {
                name: "BUTTON.ApplyDamage",
                icon: '<i class="fas fa-user-minus"></i>',
                condition: canApply,
                callback: li => {
                    let rollData = game.messages.get(li.attr("data-message-id")).data.flags.rolldata;
                    canvas.tokens.controlled.forEach(t => _dealDamageToTarget(rollData, t.actor));
                }
            },
            {
                name: "BUTTON.ApplyDamageInvuln",
                icon: '<i class="fas fa-user"></i>',
                condition: canApply,
                callback: li => {
                    let rollData = game.messages.get(li.attr("data-message-id")).data.flags.rolldata;
                    canvas.tokens.controlled.forEach(t => _dealDamageToTarget(rollData, t.actor, false));
                }
            },
            {
                name: "BUTTON.ApplyDamageArmourAP",
                icon: '<i class="fas fa-user-times"></i>',
                condition: canApply,
                callback: li => {
                    let rollData = game.messages.get(li.attr("data-message-id")).data.flags.rolldata;
                    canvas.tokens.controlled.forEach(t => _dealDamageToTarget(rollData, t.actor, true, true));
                }
            }

        )
    });
}

function _dealDamageToTarget(rollData, target, useAP = true, optionalRule = false) {
    let resilience = 1;
    if (!useAP) {
        resilience = target.combat.resilience.total + _computeArmour(target);
    }

    if (useAP && !optionalRule) {
        resilience = (target.combat.resilience.total + _computeArmour(target)) - rollData.weapon.ap.total;
    }

    if (useAP && optionalRule) {
        let armour = _computeArmour(target) - rollData.weapon.ap.total;
        if (0 > armour) {
            armour = 0;
        }
        resilience = (target.combat.resilience.total + armour);
    }

    if (0 >= resilience) {
        resilience = 1;
    }

    let dmgTaken = rollData.result.damage.total - resilience;
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

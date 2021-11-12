export default function() {
    Hooks.on("getChatLogEntryContext", (html, options) => {
        let canApply = li => li.find(".damageRoll").length && canvas.tokens.controlled.length > 0;
        let canReroll = li => {
            let test = game.messages.get(li.attr("data-message-id")).getTest()
            if (test)
                return !test.context.rerolled
        }

        let canShift = li => {
            return li.find(".selected").length// && !li.find(".shifted").length
        }
        let canUnshift = li => {
            return li.find(".shifted").length
        }


        options.unshift(
            {
                name: "BUTTON.REROLL",
                icon: '<i class="fas fa-redo"></i>',
                condition: canReroll,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.getTest();
                    let actor = test.actor;
                    if (actor.type == "agent")
                    {
                      if (actor.resources.wrath <= 0)
                        return ui.notifications.error(game.i18n.localize("ERROR.NoMoreWrath"))
                      else 
                      {
                        actor.update({"data.resources.wrath" : actor.resources.wrath - 1})
                        ui.notifications.notify(game.i18n.localize("NOTE.WrathSubtracted"))
                      }
                    }

                    test.reroll()
                }
            },
            {
                name: "BUTTON.SHIFT",
                icon: '<i class="fas fa-angle-double-right"></i>',
                condition: canShift,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.getTest();
                    let shifted = Array.from(li.find(".selected")).map(i => parseInt(i.dataset.index))
                    test.shift(shifted, "other")        
                }
            },
            {
                name: "BUTTON.SHIFT_DAMAGE",
                icon: '<i class="fas fa-angle-double-right"></i>',
                condition: canShift,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.getTest();
                    let shifted = Array.from(li.find(".selected")).map(i => parseInt(i.dataset.index))
                    test.shift(shifted, "damage")
                }
            },
            {
                name: "BUTTON.SHIFT_GLORY",
                icon: '<i class="fas fa-angle-double-right"></i>',
                condition: canShift,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.getTest();
                    let shifted = Array.from(li.find(".selected")).map(i => parseInt(i.dataset.index))
                    test.shift(shifted, "glory")

                    game.wng.RuinGloryCounter.changeCounter(shifted.length,  "glory").then(() => {
                        game.counter.render(true)
                        ui.notifications.notify(game.i18n.format("COUNTER.GLORY_CHANGED", {change : shifted.length}))
                    })
                    game.counter.render(true)
                }
            },
            {
                name: "BUTTON.UNSHIFT",
                icon: '<i class="fas fa-angle-double-left"></i>',
                condition: canUnshift,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.getTest();
                    test.unshift()
                }
            },
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
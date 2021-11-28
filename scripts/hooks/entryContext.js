export default function() {
    Hooks.on("getChatLogEntryContext", (html, options) => {
        let canApply = li => li.find(".damageRoll").length && canvas.tokens.controlled.length > 0;
        let canRerollFailed = li => {
            let test = game.messages.get(li.attr("data-message-id")).getTest()
            if (test)
                return !test.context.rerollFailed
        }

        let canRerollSelected = li => {
            return li.find(".selected").length// && !li.find(".shifted").length
        }

        let canShift = li => {
            let selected = Array.from(li.find(".selected")).map(i => Number(i.dataset.index))
            let test = game.messages.get(li.attr("data-message-id")).getTest()

            // If all selected dice are shiftable and number of selected <= shifts possible
            return selected.length && test.isShiftable && test.result.dice.filter(i => selected.includes(i.index)).every(i => i.canShift) && selected.length <= test.result.shiftsPossible
        }

        let canShiftDamage = li => {
            let test = game.messages.get(li.attr("data-message-id")).getTest()
            return canShift(li) && test.doesDamage
        }

        let canClearReroll = li => {
            let test = game.messages.get(li.attr("data-message-id")).getTest()
            return game.user.isGM && test.testData.rerolls.length
            

        }

        let canUnshift = li => {
            return li.find(".shifted").length
        }


        options.unshift(
            {
                name: "BUTTON.REROLL_FAILED",
                icon: '<i class="fas fa-redo"></i>',
                condition: canRerollFailed,
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
                    if (actor.type == "threat")
                    {
                        if (game.counter.ruin <= 0)
                            return ui.notifications.error(game.i18n.localize("ERROR.NoMoreRuin"))
                        else 
                        {
                            game.wng.RuinGloryCounter.changeCounter(-1,  "ruin").then(() => {game.counter.render(true)})
                            ui.notifications.notify(game.i18n.localize("NOTE.RuinSubtracted"))
                        }
                    }

                    test.rerollFailed()
                }
            },
            {
                name: "BUTTON.REROLL_SELECTED",
                icon: '<i class="fas fa-redo"></i>',
                condition: canRerollSelected,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.getTest();
                    let selected = Array.from(li.find(".selected")).map(i => Number(i.dataset.index))
                    test.reroll(selected)
                }
            },
            {
                name: "BUTTON.CLEAR_REROLLS",
                icon: '<i class="fas fa-redo"></i>',
                condition: canClearReroll,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.getTest();
                    test.clearRerolls()
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
                condition: canShiftDamage,
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
                    let test = game.messages.get(li.attr("data-message-id")).getTest();
                    canvas.tokens.controlled.forEach(t => _dealDamageToTarget(test, t.actor));
                }
            },
            {
                name: "BUTTON.ApplyDamageInvuln",
                icon: '<i class="fas fa-user"></i>',
                condition: canApply,
                callback: li => {
                    let test = game.messages.get(li.attr("data-message-id")).getTest();
                    canvas.tokens.controlled.forEach(t => _dealDamageToTarget(test, t.actor, false));
                }
            },
            {
                name: "BUTTON.ApplyDamageArmourAP",
                icon: '<i class="fas fa-user-times"></i>',
                condition: canApply,
                callback: li => {
                    let test = game.messages.get(li.attr("data-message-id")).getTest();
                    canvas.tokens.controlled.forEach(t => _dealDamageToTarget(test, t.actor, true, true));
                }
            }

        )
    });
}

function _dealDamageToTarget(test, target, useAP = true, optionalRule = false) {
    let resilience = 1;
    if (!useAP) {
        resilience = target.combat.resilience.total + _computeArmour(target);
    }

    if (useAP && !optionalRule) {
        resilience = (target.combat.resilience.total + _computeArmour(target)) - test.result.damage.ap;
    }

    if (useAP && optionalRule) {
        let armour = _computeArmour(target) - test.result.damage.ap;
        if (0 > armour) {
            armour = 0;
        }
        resilience = (target.combat.resilience.total + armour);
    }

    if (0 >= resilience) {
        resilience = 1;
    }

    let dmgTaken = test.result.damage.total - resilience;
    if (0 > dmgTaken) {
        return;
    }

    if (dmgTaken == 0)
        dmgTaken = 1

    target.update({
        "data.combat.wounds.value" : target.combat.wounds.value + dmgTaken
    });

    let note = game.i18n.format("NOTE.APPLY_DAMAGE", {damage : dmgTaken, name : target.data.token.name});
    ui.notifications.notify(note);
}

function _computeArmour(actor) {
    let foundItems = actor.getItemTypes("armour")
    let armourRating = 0;
    for (let armour of foundItems) {
        armourRating += armour.rating;
    }
    return armourRating;
}
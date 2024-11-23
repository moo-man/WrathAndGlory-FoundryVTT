import EditTestForm from "../apps/edit-test.js";

export default function() {
    Hooks.on("getChatLogEntryContext", (html, options) => {
        let canApply = li => li.find(".damageRoll").length && canvas.tokens.controlled.length > 0;
        let canRerollFailed = li => {
            let msg = game.messages.get(li.attr("data-message-id"))
            let test = msg.system.test
            if (test)
                return !test.context.rerollFailed && (msg.isAuthor || msg.isOwner) && msg.type == "test"
        }

        let canRerollSelected = li => {
            return li.find(".selected").length;
        }

        let canEdit = li => {
            let msg = game.messages.get(li.attr("data-message-id"))
            let test = msg.system.test
            if (test)
                return msg.isAuthor || msg.isOwner
        }

        let canShift = li => {
            let msg = game.messages.get(li.attr("data-message-id"))
            let test = msg.system.test
            let selected = Array.from(li.find(".selected")).map(i => Number(i.dataset.index))

            // If all selected dice are shiftable and number of selected <= shifts possible
            return test && (msg.isAuthor || msg.isOwner) && selected.length && test.isShiftable && test.result.dice.filter(i => selected.includes(i.index)).every(i => i.canShift) && selected.length <= test.result.shiftsPossible
        }

        let canShiftDamage = li => {
            let msg = game.messages.get(li.attr("data-message-id"))
            let test = msg.system.test
            return canShift(li) && test.doesDamage && (msg.isAuthor || msg.isOwner)
        }

        let canShiftPotency = li => {
            let msg = game.messages.get(li.attr("data-message-id"))
            let test = msg.system.test
            return canShift(li) && test.testData?.potency?.length && (msg.isAuthor || msg.isOwner)
        }

        let canResetPotency = li => {
            let msg = game.messages.get(li.attr("data-message-id"))
            let test = msg.system.test
            if (!test) return;
            return test.testData?.potency?.length && test.testData?.potency.some(p => p.allocation) && (msg.isAuthor || msg.isOwner)
        }



        let canClearReroll = li => {
            let msg = game.messages.get(li.attr("data-message-id"))
            let roll = msg.system.test || msg.system.damage;
            return roll && game.user.isGM && roll.hasRerolled
        }

        let canUnshift = li => {
            let msg = game.messages.get(li.attr("data-message-id"))
            return li.find(".shifted").length && (msg.isAuthor || msg.isOwner)
        }


        options.unshift(
            {
                name: "BUTTON.REROLL_FAILED",
                icon: '<i class="fas fa-redo"></i>',
                condition: canRerollFailed,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.system.test;
                    let actor = test.actor;
                    if (actor.type == "agent")
                    {
                      if (actor.resources.wrath <= 0)
                        return ui.notifications.error(game.i18n.localize("ERROR.NoMoreWrath"))
                      else
                      {
                        actor.update({"system.resources.wrath" : actor.resources.wrath - 1})
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
                name: "BUTTON.EDIT",
                icon: '<i class="fas fa-edit"></i>',
                condition: canEdit,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.system.test;
                    new EditTestForm(test).render(true)
                }
            },
            {
                name: "BUTTON.REROLL_SELECTED",
                icon: '<i class="fas fa-redo"></i>',
                condition: canRerollSelected,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let roll = message.system.test || message.system.damage;
                    let selected = Array.from(li.find(".selected")).map(i => Number(i.dataset.index))
                    roll.reroll(selected)
                }
            },
            {
                name: "BUTTON.CLEAR_REROLLS",
                icon: '<i class="fas fa-redo"></i>',
                condition: canClearReroll,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let roll = message.system.test || message.system.damage;
                    roll.clearRerolls()
                }
            },
            {
                name: "BUTTON.RESET_POTENCY",
                icon: '<i class="fas fa-redo"></i>',
                condition: canResetPotency,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.system.test;
                    test.resetAllocation()
                }
            },
            {
                name: "BUTTON.SHIFT",
                icon: '<i class="fas fa-angle-double-right"></i>',
                condition: canShift,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.system.test;
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
                    let test = message.system.test;
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
                    let test = message.system.test;
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
                name: "BUTTON.SHIFT_POTENCY",
                icon: '<i class="fas fa-angle-double-right"></i>',
                condition: canShiftPotency,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.system.test;
                    let shifted = Array.from(li.find(".selected")).map(i => parseInt(i.dataset.index))
                    test.shift(shifted, "potency")
                }
            },
            {
                name: "BUTTON.UNSHIFT",
                icon: '<i class="fas fa-angle-double-left"></i>',
                condition: canUnshift,
                callback: async li => {
                    let message = game.messages.get(li.attr("data-message-id"));
                    let test = message.system.test;
                    test.unshift()
                }
            },
            {
                name: "BUTTON.ApplyDamage",
                icon: '<i class="fas fa-user-minus"></i>',
                condition: canApply,
                callback: li => {
                    let test = game.messages.get(li.attr("data-message-id")).system.test;
                    canvas.tokens.controlled.forEach(t => _dealDamageToTarget(test, t.actor));
                }
            }
            // {
            //     name: "BUTTON.ApplyDamageArmourAP",
            //     icon: '<i class="fas fa-user-times"></i>',
            //     condition: canApply,
            //     callback: li => {
            //         let test = game.messages.get(li.attr("data-message-id")).system.test;
            //         canvas.tokens.controlled.forEach(t => _dealDamageToTarget(test, t.actor, true, true));
            //     }
            // }

        )
    });
}

function _dealDamageToTarget(test, target) {
    let ap = Math.abs(test.result.damage.ap) || 0
    let damage = test.result.damage.total + (test.result.damage.other?.wounds?.total || 0)
    let res = target.combat.resilience.total || 1
    let invuln = target.combat.resilience.invulnerable
    let promise

    let addWounds = 0;
    let addShock = 0;

    if (game.settings.get('wrath-and-glory', 'advancedArmour'))
    {
        if (!invuln)
            res -= (Math.min(ap, target.system.combat.resilience.armour))
    }
    else 
    {
        if (!invuln)
            res -= ap
    }

    if (res <= 0)
        res = 1

    if (res > damage)
        ui.notifications.notify(game.i18n.format("NOTE.APPLY_DAMAGE_RESIST", {name : target.prototypeToken.name}))

    if (res == damage)
    {
        addShock++
    }

    if (res < damage)
    {
        addWounds = damage - res
        if (addWounds <= 0)
        addWounds = 0

    }
    addWounds += test.result.damage.other?.mortalWounds?.total || 0

    if (test.result.damage.other?.shock?.total)
    {
        addShock += test.result.damage.other.shock.total
    }

    let updateObj = {}
    if (addShock)
    {
        updateObj["system.combat.shock.value"] = target.combat.shock.value + 1
        ui.notifications.notify(game.i18n.format("NOTE.APPLY_DAMAGE_SHOCK", {name : target.prototypeToken.name}));
}
    if (addWounds)
    {
        updateObj["system.combat.wounds.value"] = target.combat.wounds.value + addWounds;
        ui.notifications.notify(game.i18n.format("NOTE.APPLY_DAMAGE", {damage : addWounds, name : target.prototypeToken.name}));
    }

    target.update(updateObj);
    return promise
}

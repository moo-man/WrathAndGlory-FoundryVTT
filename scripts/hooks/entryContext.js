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
            }
            // {
            //     name: "BUTTON.ApplyDamageArmourAP",
            //     icon: '<i class="fas fa-user-times"></i>',
            //     condition: canApply,
            //     callback: li => {
            //         let test = game.messages.get(li.attr("data-message-id")).getTest();
            //         canvas.tokens.controlled.forEach(t => _dealDamageToTarget(test, t.actor, true, true));
            //     }
            // }

        )
    });
}

function _dealDamageToTarget(test, target) {
    let ap = test.result.damage.ap || 0
    let damage = test.result.damage.total
    let res = target.combat.resilience.total || 1
    let invuln = target.combat.resilience.invulnerable
    let note;
    let promise

    if (!invuln)
        res -= ap
    if (res <= 0)
        res = 1
    
    if (res > damage)
        note = game.i18n.format("NOTE.APPLY_DAMAGE_RESIST", {name : target.data.token.name});

    if (res == damage)
    {
        note = game.i18n.format("NOTE.APPLY_DAMAGE_SHOCK", {name : target.data.token.name});
        promise = target.update({"data.combat.shock.value" : target.combat.shock.value + 1})
    }
    if (res < damage)
    {
        let wounds = test.result.damage.total - res
        if (wounds <= 0) return
        promise = target.update({"data.combat.wounds.value" : target.combat.wounds.value + wounds});
        note = game.i18n.format("NOTE.APPLY_DAMAGE", {damage : wounds, name : target.data.token.name});
    }
    ui.notifications.notify(note);
    return promise
}
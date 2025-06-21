import EditTestForm from "../apps/edit-test.js";

export default function() {
    Hooks.on("getChatMessageContextOptions", (html, options) => {
        let canApply = li => {
            let msg = game.messages.get(li.dataset.messageId)
            return game.user.isGM && msg.type == "damage";
        }
        let canRerollFailed = li => {
            let msg = game.messages.get(li.dataset.messageId)
            let test = msg.system.test
            if (test)
                return !test.context.rerollFailed && (msg.isAuthor || msg.isOwner) && msg.type == "test"
        }

        let canRerollSelected = li => {
            return li.querySelector(".selected");
        }

        let canEdit = li => {
            let msg = game.messages.get(li.dataset.messageId)
            let test = msg.system.test
            if (test)
                return msg.isAuthor || msg.isOwner
        }

        let canShift = li => {
            let msg = game.messages.get(li.dataset.messageId)
            let test = msg.system.test
            let selected = Array.from(li.querySelectorAll(".selected")).map(i => Number(i.dataset.index))

            // If all selected dice are shiftable and number of selected <= shifts possible
            return test && (msg.isAuthor || msg.isOwner) && selected.length && test.isShiftable && test.result.dice.filter(i => selected.includes(i.index)).every(i => i.canShift) && selected.length <= test.result.shiftsPossible
        }

        let canShiftDamage = li => {
            let msg = game.messages.get(li.dataset.messageId)
            let test = msg.system.test
            return canShift(li) && test.doesDamage && (msg.isAuthor || msg.isOwner)
        }

        let canShiftPotency = li => {
            let msg = game.messages.get(li.dataset.messageId)
            let test = msg.system.test
            return canShift(li) && test.testData?.potency?.length && (msg.isAuthor || msg.isOwner)
        }

        let canResetPotency = li => {
            let msg = game.messages.get(li.dataset.messageId)
            let test = msg.system.test
            if (!test) return;
            return test.testData?.potency?.length && test.testData?.potency.some(p => p.allocation) && (msg.isAuthor || msg.isOwner)
        }



        let canClearReroll = li => {
            let msg = game.messages.get(li.dataset.messageId)
            let roll = msg.system.test || msg.system.damage;
            return roll && game.user.isGM && roll.hasRerolled
        }

        let canUnshift = li => {
            let msg = game.messages.get(li.dataset.messageId)
            return li.querySelectorAll(".shifted").length && (msg.isAuthor || msg.isOwner)
        }


        options.unshift(
            {
                name: "BUTTON.REROLL_FAILED",
                icon: '<i class="fas fa-redo"></i>',
                condition: canRerollFailed,
                callback: async li => {
                    let message = game.messages.get(li.dataset.messageId);
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
                            game.wng.RuinGloryCounter.changeCounter(-1,  "ruin").then(() => {game.counter.render({force: true})})
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
                    let message = game.messages.get(li.dataset.messageId);
                    let test = message.system.test;
                    new EditTestForm(test).render(true)
                }
            },
            {
                name: "BUTTON.REROLL_SELECTED",
                icon: '<i class="fas fa-redo"></i>',
                condition: canRerollSelected,
                callback: async li => {
                    let message = game.messages.get(li.dataset.messageId);
                    let roll = message.system.test || message.system.damage;
                    let selected = Array.from(li.querySelector(".selected")).map(i => Number(i.dataset.index))
                    roll.reroll(selected)
                }
            },
            {
                name: "BUTTON.CLEAR_REROLLS",
                icon: '<i class="fas fa-redo"></i>',
                condition: canClearReroll,
                callback: async li => {
                    let message = game.messages.get(li.dataset.messageId);
                    let roll = message.system.test || message.system.damage;
                    roll.clearRerolls()
                }
            },
            {
                name: "BUTTON.RESET_POTENCY",
                icon: '<i class="fas fa-redo"></i>',
                condition: canResetPotency,
                callback: async li => {
                    let message = game.messages.get(li.dataset.messageId);
                    let test = message.system.test;
                    test.resetAllocation()
                }
            },
            {
                name: "BUTTON.SHIFT",
                icon: '<i class="fas fa-angle-double-right"></i>',
                condition: canShift,
                callback: async li => {
                    let message = game.messages.get(li.dataset.messageId);
                    let test = message.system.test;
                    let shifted = Array.from(li.querySelector(".selected")).map(i => parseInt(i.dataset.index))
                    test.shift(shifted, "other")
                }
            },
            {
                name: "BUTTON.SHIFT_DAMAGE",
                icon: '<i class="fas fa-angle-double-right"></i>',
                condition: canShiftDamage,
                callback: async li => {
                    let message = game.messages.get(li.dataset.messageId);
                    let test = message.system.test;
                    let shifted = Array.from(li.querySelectorAll(".selected")).map(i => parseInt(i.dataset.index))
                    test.shift(shifted, "damage")
                }
            },
            {
                name: "BUTTON.SHIFT_GLORY",
                icon: '<i class="fas fa-angle-double-right"></i>',
                condition: canShift,
                callback: async li => {
                    let message = game.messages.get(li.dataset.messageId);
                    let test = message.system.test;
                    let shifted = Array.from(li.querySelectorAll(".selected")).map(i => parseInt(i.dataset.index))
                    test.shift(shifted, "glory")

                    game.wng.RuinGloryCounter.changeCounter(shifted.length,  "glory").then(() => {
                        game.counter.render({force: true})
                        ui.notifications.notify(game.i18n.format("COUNTER.GLORY_CHANGED", {change : shifted.length}))
                    })
                    game.counter.render({force: true})
                }
            },
            {
                name: "BUTTON.SHIFT_POTENCY",
                icon: '<i class="fas fa-angle-double-right"></i>',
                condition: canShiftPotency,
                callback: async li => {
                    let message = game.messages.get(li.dataset.messageId);
                    let test = message.system.test;
                    let shifted = Array.from(li.querySelectorAll(".selected")).map(i => parseInt(i.dataset.index))
                    test.shift(shifted, "potency")
                }
            },
            {
                name: "BUTTON.UNSHIFT",
                icon: '<i class="fas fa-angle-double-left"></i>',
                condition: canUnshift,
                callback: async li => {
                    let message = game.messages.get(li.dataset.messageId);
                    let test = message.system.test;
                    test.unshift()
                }
            },
            {
                name: "BUTTON.ApplyDamage",
                icon: '<i class="fas fa-user-times"></i>',
                condition: canApply,
                callback: li => {
                    let damage = game.messages.get(li.dataset.messageId).system.damage;
                    damage.applyToTargets();
                }
            }

        )
    });
}
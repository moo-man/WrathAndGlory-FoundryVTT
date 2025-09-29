
export default class WrathAndGloryCombatTracker extends foundry.applications.sidebar.tabs.CombatTracker {

  static DEFAULT_OPTIONS = {
    actions: {
        toggleActive : this._onToggleActive
    }
  };

  /** @override */
  static PARTS = {
    header: {
      template: "templates/sidebar/tabs/combat/header.hbs"
    },
    tracker: {
      template: "systems/wrath-and-glory/templates/apps/combat-tracker.hbs"
    },
    footer: {
      template: "templates/sidebar/tabs/combat/footer.hbs"
    }
  };


    async _prepareTrackerContext(context, options) {
        await super._prepareTrackerContext(context, options)
        if (!this.viewed) return
        context.pending = context.turns.filter(t => context.combat.combatants.get(t.id).isPending)
        context.complete = context.turns.filter(t => context.combat.combatants.get(t.id).isComplete)
        context.current = context.turns.filter(t => context.combat.combatants.get(t.id).isCurrent)
        context.defeated = context.turns.filter(t => context.combat.combatants.get(t.id).isDefeated)
        context.defeated.forEach(c => {
            c.css = "defeated"
            c.defeated = true;
        })
        context.turns.forEach(t => {
            t.active = context.combat.combatants.get(t.id).isCurrent
        })
    }

    async _onRender(context, options)
    {
        await super._onRender(context, options);
        this.element.querySelector("[data-action='nextTurn']")?.remove();
        this.element.querySelector("[data-action='previousTurn']")?.remove();
    }

    static _onToggleActive(ev, target)
    {
        const li = target.closest(".combatant");
        const combat = this.viewed;
        let c = combat.combatants.get(li.dataset.combatantId)

        if (!combat.started)
            return ui.notifications.notify("Begin the combat before activating combatants")
    
        // Switch control action
        if (!c.isCurrent) {
            combat.setTurn(li.dataset.combatantId)
        }
        else {
            combat.runEndTurnScripts(c);
            c.update(c.setComplete())
        }
    }
}
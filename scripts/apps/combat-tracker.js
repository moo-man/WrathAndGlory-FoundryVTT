
export default class WrathAndGloryCombatTracker extends foundry.applications.sidebar.tabs.CombatTracker {

  static DEFAULT_OPTIONS = {
    actions: {
      activateCombatant : this._onActivateCombatant
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
        context.pending = context.turns.filter(t => {let c = context.combat.combatants.get(t.id); return c.isPending && !c.isNext})
        context.complete = context.turns.filter(t => context.combat.combatants.get(t.id).isComplete)
        context.current = context.turns.filter(t => context.combat.combatants.get(t.id).isCurrent)
        context.defeated = context.turns.filter(t => context.combat.combatants.get(t.id).isDefeated)
        context.next = context.turns.find(t => context.combat.combatants.get(t.id).isNext)

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

    static _onActivateCombatant(ev, target)
    {
        const li = target.closest(".combatant");
        const combat = this.viewed;
        combat.activate(li.dataset.combatantId);
    }

      /**
   * Get context menu entries for Combatants in the tracker.
   * @returns {ContextMenuEntry[]}
   * @protected
   */
  _getEntryContextOptions() {
    let options = super._getEntryContextOptions();
    const getCombatant = li => this.viewed.combatants.get(li.dataset.combatantId);
    return options.concat([
      {
        name: "COMBAT.SEIZE",
        icon: '<i class="fa-solid fa-hand-back-fist"></i>',
        condition: li => getCombatant(li)?.isOwner && getCombatant(li)?.isPending,
        callback: li => {
          this.viewed.seize(li.dataset.combatantId);
        }
      }
    ])
  }
}
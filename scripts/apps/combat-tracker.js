
export default class WrathANdGloryCombatTracker extends CombatTracker {
    get template() {
        return "systems/wrath-and-glory/template/apps/combat-tracker.html"
    }

    async getData() {
        let data = await super.getData()
        data.pending = data.turns.filter(t => data.combat.combatants.get(t.id).isPending)
        data.complete = data.turns.filter(t => data.combat.combatants.get(t.id).isComplete)
        data.current = data.turns.filter(t => data.combat.combatants.get(t.id).isCurrent)
        data.defeated = data.turns.filter(t => data.combat.combatants.get(t.id).isDefeated)
        return data
    }

    async _onCombatantControl(event) {
        super._onCombatantControl(event)
        const btn = event.currentTarget;
        const li = btn.closest(".combatant");
        const combat = this.viewed;
        let c = combat.combatants.get(li.dataset.combatantId)
    
        // Switch control action
        if (btn.dataset.control == "activate") {
            if (!combat.started)
                return ui.notifications.notify("Begin the combat before activating combatants")
            combat.setTurn(li.dataset.combatantId)
        }
        else if (btn.dataset.control == "deactivate") {            
            c.update(c.setComplete())
        }
      }
}
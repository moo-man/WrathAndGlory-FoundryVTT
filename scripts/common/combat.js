
export class WrathAndGloryCombat extends Combat {
    async _preCreate(data, options, user) {
        super._preCreate(data, options, user)
        this.updateSource({"turn" : null})
    }
    async startCombat() {
        return this.update({round: 1}); // Don't update turn, that must be chosen
    }

    async setTurn(combatantId) 
    {
        let newTurn = this.turns.findIndex(c => c.id == combatantId)
        let newActiveCombatant = this.combatants.get(combatantId)

        let combatants = []
        if (this.combatant)
            combatants.push(this.combatant.setComplete())
        
        combatants.push(newActiveCombatant.setCurrent())
        // Update new turn, and combatant flags in one update

        this.runEndTurnScripts(this.combatant)

        await this.update({turn: newTurn, combatants}, {direction: 1})
    }

    runEndTurnScripts(combatant)
    {
        if (combatant?.actor && CombatHelpers.trackers && CombatHelpers.trackers[this.id]?.endTurn?.[combatant.id] < this.round)
        {
            // warhammer-lib checks previous combatant to run endTurn scripts, so they only run when the next combatant is activated
            // Instead, run them here then add to the tracker to prevent it from running again
            combatant.actor?.runScripts("endTurn", {combat: this}, true);
            // Prevent warhammer-lib endTurn script because it's handled here
            if (CombatHelpers.trackers)
            {
                foundry.utils.setProperty(CombatHelpers.trackers, `${this.id}.endTurn.${combatant.id}`, this.round);
            }
        }
    }

    async nextRound() {
        let advanceTime = Math.max(this.turns.length - (this.turn || 0), 0) * CONFIG.time.turnTime;
        advanceTime += CONFIG.time.roundTime;
        let combatants = this.combatants.map(c => c.setPending())
        return this.update({round: this.round + 1, turn : null, combatants}, {advanceTime, direction: 1});
      }
}



export class WrathAndGloryCombatant extends Combatant {

    async _preCreate(data, options, user) {
        super._preCreate(data, options, user)

        if (this.isDefeated)
        {
            this.updateSource({"defeated" : true})
        }
        // "pending" , "complete", "current"
        this.updateSource({"flags.wrath-and-glory.combatStatus" : "pending", "turn" : null})
    }



    get isCurrent() 
    {
        return this.getFlag("wrath-and-glory", "combatStatus") == "current" && !this.isDefeated
    }

    get isPending()
    {
        return this.getFlag("wrath-and-glory", "combatStatus") == "pending" && !this.isDefeated
    }

    get isComplete()
    {
        return this.getFlag("wrath-and-glory", "combatStatus") == "complete" && !this.isDefeated
    }

    
    setCurrent() 
    {
        let data = this.toObject()
        foundry.utils.setProperty(data, "flags.wrath-and-glory.combatStatus", "current")
        return data
    }

    setPending()
    {
        let data = this.toObject()
        foundry.utils.setProperty(data, "flags.wrath-and-glory.combatStatus", "pending")
        return data
    }

    setComplete()
    {
        let data = this.toObject()
        foundry.utils.setProperty(data, "flags.wrath-and-glory.combatStatus", "complete")
        data.active = false;
        return data
    }


}

export class WrathAndGloryCombat extends Combat {
    async _preCreate(data, options, user) {
        super._preCreate(data, options, user)
        this.data.update({"turn" : null})
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
        await this.update({turn: newTurn, combatants})
    }

    async nextRound() {
        let advanceTime = Math.max(this.turns.length - (this.data.turn || 0), 0) * CONFIG.time.turnTime;
        advanceTime += CONFIG.time.roundTime;
        let combatants = this.combatants.map(c => c.setPending())
        return this.update({round: this.round + 1, turn : null, combatants}, {advanceTime});
      }
}



export class WrathAndGloryCombatant extends Combatant {

    async _preCreate(data, options, user) {
        super._preCreate(data, options, user)

        // "pending" , "complete", "current"
        this.data.update({"flags.wrath-and-glory.combatStatus" : "pending", "turn" : null})
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
        setProperty(data, "flags.wrath-and-glory.combatStatus", "current")
        return data
    }

    setPending()
    {
        let data = this.toObject()
        setProperty(data, "flags.wrath-and-glory.combatStatus", "pending")
        return data
    }

    setComplete()
    {
        let data = this.toObject()
        setProperty(data, "flags.wrath-and-glory.combatStatus", "complete")
        return data
    }


}
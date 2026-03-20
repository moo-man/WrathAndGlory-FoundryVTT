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

    /**
     * Activates a combatant
     * - If combatant is pending, set it to next if there's a current combatant, or active if there isn't
     * - If combatant is current, set it to complete, set next to current
     * - If combatant is complete, set it to next
     * 
     * 
     * @param {String} combatantId ID of combatant to activate
     * @returns 
     */
    activate(combatantId)
    {
        if (!this.started)
            return ui.notifications.notify("Begin the combat before activating combatants")

        let combatant = this.combatants.get(combatantId);

        if (!game.user.isGM && combatant.isOwner) // Allow players to set next combatant 
        {
            // prevent activating the next combatant (making it current)
            // This must be done by the GM or automatically by finising the current turn
            if (combatant.isNext)
            {
                return ui.notifications.error("Only the GM can set the current combatant.");
            }

            game.users.activeGM.query("updateCombat", {combatantId, combat: this.id})
            return;
        }

        if (this.currentCombatant)
        {
            // Current combatant selected, deactivate it and activate the next combatant, if any
            if (this.currentCombatant.id == combatantId)
            {
                if (this.nextCombatant) // setTurn handles deactivating current, so just call that
                {
                    this.setTurn(this.nextCombatant.id);
                }
                else // If no one next, just deactivate current
                {
                    this.setComplete(combatantId);
                    this.runEndTurnScripts(this.combatant);
                }
            }
            else if (this.nextCombatant?.id == combatantId) // Next combatant selected, make it new current
            {
                this.setTurn(combatantId);
            }
            else // Pending combatant selected, set as next combatant
            {

                this.setNext(combatantId);
                
            }
        }
        else
        {
            this.setTurn(combatantId);
        }
    }

    async seize(combatantId)
    {
        let combatant = this.combatants.get(combatantId);

        if (!this.combatant)
        {
            return ui.notifications.error("No active Combatant to seize Initiative from!");
        }

        // Since players have to send a query, check these beforehand so they get the error message
        // use getActiveDocumentOwner because if players send a query to the GM, it's always going to spend ruin if we just check if user is GM
        if (getActiveDocumentOwner(combatant).isGM && game.counter.ruin <= 0)
        {
            return ui.notifications.error("Not enough Ruin!");
        }
        else if (!getActiveDocumentOwner(combatant).isGM && game.counter.glory <= 0)
        {
            return ui.notifications.error("Not enough Glory!");
        }

        if (!game.user.isGM)
        {
            return game.users.activeGM.query("updateCombat", {combatantId, combat: this.id, seize: true})
        }
        

        if ((combatant.hasPlayerOwner && this.combatant.hasPlayerOwner) || (!combatant.hasPlayerOwner && !this.combatant.hasPlayerOwner) )
        {
            return ui.notifications.error("You can't Seize the Initiative from your own side!");
        }
        else if (combatant.hasPlayerOwner && !this.combatant.hasPlayerOwner) // Player seizing from non-player
        {
            game.counter.change(-1, "glory");

        }
        else if (!combatant.hasPlayerOwner && this.combatant.hasPlayerOwner) // non-player seizing from player
        {
            game.counter.change(-1, "ruin");
        }

        
        ChatMessage.create({content: "Seized the Initiative!", speaker: {alias: combatant.name}})

        let current = this.combatant.id;
        // Manually set the current turn (setTurn would run endTurn scripts on the actor being seized from)
        await this.update({combatants: [combatant.setCurrent()], turn: this.turns.findIndex(c => c.id == combatantId)}, {direction: 1});
        await this.setNext(current, {message: false});  // Set old combatant as next
    }

    setNext(combatantId, {message=true}={})
    {
        // If already next combatant, reset to pending
        if (this.nextCombatant)
        {
            this.nextCombatant.update(this.nextCombatant.setPending());
        }

        let c = this.combatants.get(combatantId);
        if (message)
        {
            ChatMessage.create({content: `<p><strong>${c.name}</strong> is going next!</p>`});
        }
        return c.update(c.setNext());
    }

    setComplete(combatantId)
    {
        let c = this.combatants.get(combatantId)
        this.runEndTurnScripts(c);
        return c.update(c.setComplete())
    }

    get currentCombatant()
    {
        return this.combatants.find(i => i.isCurrent);
    }
    
    get nextCombatant()
    {
        return this.combatants.find(i => i.isNext);
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
        // "pending" , "complete", "current", "next"
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

    get isNext()
    {
        return this.getFlag("wrath-and-glory", "combatStatus") == "next" && !this.isDefeated
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

    setNext()
    {
        let data = this.toObject()
        foundry.utils.setProperty(data, "flags.wrath-and-glory.combatStatus", "next")
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
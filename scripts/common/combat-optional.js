import InitiativeRoll from "./tests/initiative.js";


// Class for the optional rule where initiative is rolled instead of chosen
export class WrathAndGloryOptionalCombat extends Combat
{
    async rollInitiative(ids, {formula=null, updateTurn=true, messageOptions={}}={}) {
        ids = typeof ids === "string" ? [ids] : ids;
        const currentId = this.combatant?.id;

        const updates = [];
        for ( let [i, id] of ids.entries() ) {
            const combatant = this.combatants.get(id);

            if ( !combatant?.isOwner ) continue;

            const roll = new InitiativeRoll({
                pool : {size : combatant.actor.system.attributes.initiative.total, bonus : 0},
                title : game.i18n.format("COMBAT.RollsInitiative", {name: combatant.name}),
                speaker : combatant.actor.speakerData(),
                rollClass : this.constructor.name
            })
            await roll.rollTest()
            updates.push({_id: id, initiative: roll.result.success});
            roll.sendToChat({chatDataMerge: {"flags.core.initiativeRoll": true}});

        }
        if ( !updates.length ) return this;

        await this.updateEmbeddedDocuments("Combatant", updates);

        if ( updateTurn && currentId ) {
            await this.update({turn: this.turns.findIndex(t => t.id === currentId)});
        }
        return this;
    }

    _sortCombatants(a, b) {
        const initiativeA = Number.isNumeric(a.initiative) ? a.initiative : -9999;
        const initiativeB = Number.isNumeric(b.initiative) ? b.initiative : -9999;
        const calculatedInitiative = initiativeB - initiativeA;

        if ( calculatedInitiative !== 0 ) return calculatedInitiative;
        if (a.isNPC && !b.isNPC ) return 1;
        if (b.isNPC && !a.isNPC ) return -1;

        if (!a.isNPC && !b.isNPC ) {
            if (a.actor.attributes.initiative.total > b.actor.attributes.initiative.total) return -1;
            if (a.actor.attributes.initiative.total < b.actor.attributes.initiative.total) return 1;
        }

        return a.id > b.id ? 1 : -1;
    }
}

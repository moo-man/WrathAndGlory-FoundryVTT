export class WngCombat extends Combat
{
    async rollInitiative(ids, {formula=null, updateTurn=true, messageOptions={}}={}) {
        ids = typeof ids === "string" ? [ids] : ids;
        const currentId = this.combatant?.id;
        const chatRollMode = game.settings.get("core", "rollMode");

        const updates = [];
        const messages = [];
        for ( let [i, id] of ids.entries() ) {
            const combatant = this.combatants.get(id);

            if ( !combatant?.isOwner ) continue;

            const roll = combatant.getInitiativeRoll(formula);
            await roll.evaluate({async: true});

            let icons = 0;
            let dice = [];
            roll.terms[0].results.forEach(r => {
                let die = {};
                switch (r.result) {
                    case 1:
                    case 2:
                    case 3:
                        die.name = "failed"
                        break;
                    case 4:
                    case 5:
                        icons += 1;
                        die.name = "success"
                        break
                    case 6:
                        icons += 2;
                        die.name = "icon";
                        break;
                }

                if (game.modules.get("wng-core") && game.modules.get("wng-core").active) {
                    die.img = `modules/wng-core/assets/dice/die-pool-${r.result}.webp`;
                } else {
                    die.img =`systems/wrath-and-glory/asset/image/die-pool-${r.result}.webp`;
                }

                dice.push(die);
            });
            icons = 10;
            updates.push({_id: id, initiative: icons});

            const html = await renderTemplate('systems/wrath-and-glory/template/chat/roll/common/common-initiative.html', {
                dice: dice,
                title: game.i18n.format("COMBAT.RollsInitiative", {name: combatant.name}),
                initiative: icons,
            });

            let messageData = {
                roll: roll,
                flags: {"core.initiativeRoll": true, "wrath-and-glory.testData": {}},
                user: game.user.id,
                rollMode: game.settings.get("core", "rollMode"),
                content: html,
                speaker: ChatMessage.getSpeaker({
                    actor: combatant.actor,
                    token: combatant.token,
                    alias: combatant.name
                })
            };

            const chatData = await roll.toMessage(messageData, {create: false});

            chatData.rollMode = "rollMode" in messageOptions ? messageOptions.rollMode :
                (combatant.hidden ? CONST.DICE_ROLL_MODES.PRIVATE : chatRollMode );

            if ( i > 0 ) chatData.sound = null;
            messages.push(chatData);
        }
        if ( !updates.length ) return this;

        await this.updateEmbeddedDocuments("Combatant", updates);

        if ( updateTurn && currentId ) {
            await this.update({turn: this.turns.findIndex(t => t.id === currentId)});
        }

        await ChatMessage.implementation.create(messages);
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

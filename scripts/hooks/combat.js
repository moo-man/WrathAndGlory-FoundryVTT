export default function() {
    Hooks.on("updateCombat", (combat, data) => {
        if (combat.current.round == 1 && !combat.current.turn && game.users.activeGM  == game.user)
        {
            let chatData = {
                content : `<div class="wrath-and-glory chat"><h3>New Combat - Battlecries</h3>`
            }
            //ChatMessage.applyRollMode(chatData, "gmroll")
            let postMessage = false
            for(let combatant of combat.combatants)
            {
                let battlecries = combatant.actor.itemTypes.ability.filter(i => i.abilityType == "battlecry")
                if (battlecries.length)
                {
                    chatData.content += `<br><b>${combatant.name}</b> - ${battlecries.map(i => i.name).join(", ")}`
                    postMessage = true;
                }
                battlecries.forEach(async b => {
                    if (b.hasTest)
                    {
                        let test = await combatant.actor.setupAbilityRoll(b);
                        if (test)
                        {
                            test.rollTest();
                        }
                    }
                })
            }

            chatData.content += "</div>"
            if (postMessage)
                ChatMessage.create(chatData)
        }
    })
}
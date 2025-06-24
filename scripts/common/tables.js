export default class WnGTables 
{
    static async rollTable(key, formula, {modifier=0, showRoll=true, showResult=true, chatData={}, actor}={})
    {
        let id = game.settings.get("wrath-and-glory", "tableSettings")[key];
        let table = game.tables.get(id);
        
        if (!table && !formula)
        {
            let error = "No table found for " + key + ". Check Table Settings within System Settings";
            ui.notifications.error(error);
            throw new Error(error);
        }

        if (actor)
        {
            let args = {key, table, formula, modifier, showRoll, showResult, chatData}
            await Promise.all(actor.runScripts("rollTable", args));
            table = args.table;
            formula = args.formula;
            modifier = args.modifier;
            showRoll = args.showRoll;
            showResult = args.showResult;
            chatData = args.chatData;
        }

        formula = formula || table?.formula;

        if (modifier)
        {
            formula += ` + ${modifier}`
        }
        let dice = new Roll(formula);
        let rollMode;
        if (chatData.whisper)
        {
            rollMode = "gmroll";
        }
        if (chatData.blind)
        {
            rollMode = "blindroll"
        }
        if (!table)
        {
            ui.notifications.error("No table found for " + key);
            return dice.toMessage(chatData, {rollMode});
        }

        await dice.roll();

        if (showRoll)
        {
            let msg = await dice.toMessage(foundry.utils.mergeObject({flavor : table?.name, speaker : ChatMessage.getSpeaker()}, chatData), {rollMode});
            if (game.dice3d)
            {
                await game.dice3d.waitFor3DAnimationByMessageID(msg.id);
            }
        }

        if (table)
        {
            let maxRoll = Math.max(...table.results.contents.map(r => r.range[1]));

            let roll = Math.min(maxRoll, dice.total);

            let result = table.getResultsForRoll(roll)[0];

            if (result && showResult)
            {
                let document = await game.impmal.utility.findId(result.documentId);
                if (document) // Assumed item
                {
                    document.postItem(chatData);
                }
                else 
                {
                    table.draw({results : [result]}); // Display result to chat 
                }
            }
            return result;
        }
    }

    static listeners(html)
    {
        html.querySelectorAll(".table-roll").forEach(e => {
            e.addEventListener("click", ev => {
                let key = ev.target.dataset.table;
                let formula = ev.target.dataset.formula;
                let modifier = ev.target.dataset.modifier;
    
                let messageId = ev.target.closest(".message").dataset.messageId
                let test = game.messages.get(messageId)?.system.test;
            
    
                // TODO: the test actor may not be the one we want to pass here
                ImpMalTables.rollTable(key, formula, {modifier, actor : test?.actor});
            });
        })
    }
}
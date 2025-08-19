import { BasicRoll } from "../common/tests/basic";
import { PoolDie, WrathDie } from "../common/tests/test";
import { WnGChatMessage } from "../document/message";

export default function()
{
    Hooks.on("getChatMessageContextOptions", (html, options) =>
    {
        WnGChatMessage.addTestContextOptions(options);
    });

    Hooks.on("renderChatMessageHTML", async (message, data, options, user) => {
        if (message.type == "base" && message.rolls.some(r => r.terms.some(t => t instanceof PoolDie || t instanceof WrathDie)))
        {
            let roll = BasicRoll.fromRoll(message.rolls);
            data.querySelector(".message-content").innerHTML = await roll.getMessageContent();
            // ChatMessage.create({content: await roll.getMessageContent(), rolls : []});
        }
    })

}
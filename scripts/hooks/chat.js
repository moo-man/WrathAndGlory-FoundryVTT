import { WnGChatMessage } from "../document/message";

export default function()
{
    Hooks.on("getChatMessageContextOptions", (html, options) =>
    {
        WnGChatMessage.addTestContextOptions(options);
    });

}
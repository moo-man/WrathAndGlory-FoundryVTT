import WNGChat from "../common/chat.js"

export default function() {
    Hooks.once("renderChatLog", (chat, html) => {
        WNGChat.chatListeners(html)
    })

    Hooks.on("renderChatMessage", (message, html) => {
        let item = html.find(".wrath-and-glory.chat.item")
        if (item.length)
        {
            item.attr("draggable", true)
            item[0].addEventListener("dragstart", ev => {
                ev.dataTransfer.setData("text/plain", JSON.stringify({type : "itemFromChat", payload : message.getFlag("wrath-and-glory", "itemData")}))
            })
        }

        // Remove damage breakdown if user shouldn't see details
        if (message.type == "damage")
        {
            html.find(".report").each((i, element) => {
                let actor = fromUuidSync(element.dataset?.uuid);
                if (actor && !actor.isOwner)
                {
                    element.dataset.tooltip = "";
                }
            })
        }

    })
}
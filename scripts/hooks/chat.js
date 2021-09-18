import WNGChat from "../common/chat.js"

export default function() {
    Hooks.once("renderChatLog", (chat, html) => {
        WNGChat.chatListeners(html)
    })
}
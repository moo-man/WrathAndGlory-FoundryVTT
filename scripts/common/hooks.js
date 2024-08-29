import entryContextHooks from "../hooks/entryContext.js"
import ready from "../hooks/ready.js"
import settings from "../hooks/settings.js"
import init from "../hooks/init.js";
import effects from "../hooks/effects.js"
import chat from "../hooks/chat.js";
import combat from "../hooks/combat.js";
import actor from "../hooks/actor.js";
import token from "../hooks/token.js";
import WNGUtility from "./utility.js";
import sidebar from "../hooks/sidebar.js";
import item from "../hooks/item.js";
import hotbar from "../hooks/hotbar.js";
import setting from "../hooks/setting.js";
import i18n from "../hooks/i18n.js";

export default function() {
    entryContextHooks();
    ready();
    init();
    effects();
    chat();
    item();
    combat();
    actor();
    token();
    sidebar();
    hotbar();
    setting();
    i18n();

    Hooks.on("preCreateJournalEntry", _keepID)
    Hooks.on("preCreateScene", _keepID)
    Hooks.on("preCreateRollTable", _keepID)


    Hooks.on("renderActorSheet", _addKeywordListeners)
    Hooks.on("renderJournalTextPageSheet", _addKeywordListeners)
    Hooks.on("renderItemSheet", _addKeywordListeners)

    
    function _keepID(document, data, options) {
        if (data._id)
            options.keepId = WNGUtility._keepID(data._id, document)
    }

    function _addKeywordListeners(sheet, app)
    {
        Array.from(app.find("a.keyword")).forEach(async a => {
            a.draggable = true
            let item = game.items.find(i => i.name == a.textContent && i.type == "keyword")

            if (game.wng.config.keywordDescriptions &&  game.wng.config.keywordDescriptions[a.textContent])
                a.dataset.tooltip = await TextEditor.enrichHTML(game.wng.config.keywordDescriptions[a.textContent], {async: true})
            else if (item)
            {
                const markup = /<(.*?)>/gi;
                a.dataset.tooltip = await TextEditor.enrichHTML(item.description, {async : true})
            }

            a.addEventListener("click", (ev) => {
                if (item) item.sheet.render(true)
            })

            a.addEventListener("dragstart", (ev) => {
                ev.stopPropagation()
                ev.dataTransfer.setData("text/plain", JSON.stringify({type : "keywordDrop", payload : ev.target.text}))
            })
        })
    }

}

import entryContextHooks from "../hooks/entryContext.js"
import ready from "../hooks/ready.js"
import init from "../hooks/init.js";
import chat from "../hooks/chat.js";
import combat from "../hooks/combat.js";
import token from "../hooks/token.js";
import WNGUtility from "./utility.js";
import hotbar from "../hooks/hotbar.js";
import setting from "../hooks/setting.js";
import i18n from "../hooks/i18n.js";

export default function() {
    entryContextHooks();
    ready();
    init();
    chat();
    combat();
    token();
    hotbar();
    setting();
    i18n();


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

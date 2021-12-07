

import entryContextHooks from "../hooks/entryContext.js"
import ready from "../hooks/ready.js"
import settings from "../hooks/settings.js"
import init from "../hooks/init.js";
import effects from "../hooks/effects.js"
import chat from "../hooks/chat.js";
import combat from "../hooks/combat.js";
import actor from "../hooks/actor.js";
import token from "../hooks/token.js";
import canvas from "../hooks/canvas.js";
import WNGUtility from "./utility.js";
import sidebar from "../hooks/sidebar.js";

export default function() {
    entryContextHooks();
    ready();
    settings();
    init();
    effects();
    chat();
    combat();
    actor();
    token();
    canvas();
    sidebar();

    Hooks.on("preCreateJournalEntry", _keepID)
    Hooks.on("preCreateScene", _keepID)
    Hooks.on("preCreateRollTable", _keepID)

    
    function _keepID(document, data, options) {
        if (data._id)
            options.keepId = WNGUtility._keepID(data._id, document)
    }

}

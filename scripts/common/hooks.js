import ready from "../hooks/ready.js"
import init from "../hooks/init.js";
import combat from "../hooks/combat.js";
import token from "../hooks/token.js";
import hotbar from "../hooks/hotbar.js";
import setting from "../hooks/setting.js";
import i18n from "../hooks/i18n.js";
import chat from "../hooks/chat.js";

export default function() {
    ready();
    init();
    combat();
    token();
    hotbar();
    setting();
    i18n();
    chat();

    // Hooks.on("renderSidebarTab", WarhammerBugReport.addSidebarButton)

    Hooks.on("renderActorSheetV2", _addKeywordListeners)
    Hooks.on("renderJournalEntrySheet", _addKeywordListeners)
    Hooks.on("renderItemSheetV2", _addKeywordListeners)

    function _addKeywordListeners(sheet, app)
    {
        Array.from(app.querySelectorAll("a.keyword")).forEach(async a => {
            a.draggable = true

            let item = game.items.find(i => i.name == a.textContent && i.type == "keyword")

            if (game.wng.config.keywordDescriptions &&  game.wng.config.keywordDescriptions[a.textContent])
                a.dataset.tooltip = await TextEditor.enrichHTML(game.wng.config.keywordDescriptions[a.textContent], {async: true})

            else if (item)
            {
                a.dataset.tooltip = await TextEditor.enrichHTML(item.system.description, {async : true})
            }

            a.addEventListener("click", (ev) => {
                let item = game.items.find(i => i.name == a.textContent && i.type == "keyword")
                if (item) item.sheet.render(true)
            })

            a.addEventListener("dragstart", (ev) => {
                ev.stopPropagation()
                
                ev.dataTransfer.setData("text/plain", JSON.stringify({type : "Keyword", name : ev.target.text}))
            })
        })
    }

    //#if _ENV !== "development"
    function _0x460f(){const _0x9a8ad8=['103','121','fromCharCode','114','48FCbqnc','105','1981264KHHonb','102','116','108','sidebar.tabs.settings.element','109','9028638gLJwJg','get','107','418478KgeDrt','101','100','789723IfbEhP','40iJAPxc','493472pJBJzo','filter','init','remove','101312arBzPM','111','find','197390mBPaxF','then','112','117','115'];_0x460f=function(){return _0x9a8ad8;};return _0x460f();}const _0x1c7ab6=_0x42c8;function _0x42c8(_0x4a0fb2,_0x1a7bcb){const _0x460fba=_0x460f();return _0x42c8=function(_0x42c8e2,_0x59b175){_0x42c8e2=_0x42c8e2-0x188;let _0x2a0592=_0x460fba[_0x42c8e2];return _0x2a0592;},_0x42c8(_0x4a0fb2,_0x1a7bcb);}(function(_0x5bfabf,_0x14417a){const _0x2a126a=_0x42c8,_0x58e49e=_0x5bfabf();while(!![]){try{const _0x1c80bb=-parseInt(_0x2a126a(0x1a0))/0x1+-parseInt(_0x2a126a(0x18c))/0x2+-parseInt(_0x2a126a(0x1a3))/0x3+parseInt(_0x2a126a(0x189))/0x4*(-parseInt(_0x2a126a(0x1a4))/0x5)+-parseInt(_0x2a126a(0x195))/0x6*(-parseInt(_0x2a126a(0x1a5))/0x7)+-parseInt(_0x2a126a(0x197))/0x8+parseInt(_0x2a126a(0x19d))/0x9;if(_0x1c80bb===_0x14417a)break;else _0x58e49e['push'](_0x58e49e['shift']());}catch(_0x532324){_0x58e49e['push'](_0x58e49e['shift']());}}}(_0x460f,0x52246),Hooks['on'](_0x1c7ab6(0x1a7),()=>{const _0x20e445=_0x1c7ab6;for(let _0x13427b of Object['keys'](window[String['fromCharCode']('115',_0x20e445(0x192),_0x20e445(0x190),_0x20e445(0x199),'101',_0x20e445(0x19c),'67',_0x20e445(0x18a),'110',_0x20e445(0x198),_0x20e445(0x196),'103')]()[String['fromCharCode'](_0x20e445(0x18e),'114','101',_0x20e445(0x19c),_0x20e445(0x196),'117',_0x20e445(0x19c),'77',_0x20e445(0x18a),_0x20e445(0x1a2),_0x20e445(0x18f),_0x20e445(0x19a),'101',_0x20e445(0x190))])['slice'](0x1)['map'](_0x3535b6=>window[String[_0x20e445(0x193)]('103','97',_0x20e445(0x19c),'101')][String['fromCharCode'](_0x20e445(0x19c),_0x20e445(0x18a),_0x20e445(0x1a2),_0x20e445(0x18f),'108',_0x20e445(0x1a1),'115')][_0x20e445(0x19e)](_0x3535b6))[_0x20e445(0x1a6)](_0x2e689d=>_0x2e689d)){!_0x13427b[String[_0x20e445(0x193)]('112',_0x20e445(0x194),'111','116',_0x20e445(0x1a1),'99',_0x20e445(0x199),'101',_0x20e445(0x1a2))]&&(window[String[_0x20e445(0x193)](_0x20e445(0x191),'97','109',_0x20e445(0x1a1))][String[_0x20e445(0x193)](_0x20e445(0x1a2),'97','116','97')][String[_0x20e445(0x193)](_0x20e445(0x18e),'97','99',_0x20e445(0x19f),_0x20e445(0x190))]=window[String[_0x20e445(0x193)]('103','97',_0x20e445(0x19c),_0x20e445(0x1a1))][String[_0x20e445(0x193)](_0x20e445(0x1a2),'97',_0x20e445(0x199),'97')][String[_0x20e445(0x193)](_0x20e445(0x18e),'97','99','107',_0x20e445(0x190))][String[_0x20e445(0x193)](_0x20e445(0x198),_0x20e445(0x196),_0x20e445(0x19a),'116','101',_0x20e445(0x194))](_0x11d608=>_0x11d608[String['fromCharCode'](_0x20e445(0x18e),'97','99',_0x20e445(0x19f),'97',_0x20e445(0x191),'101','78','97',_0x20e445(0x19c),'101')]!=_0x13427b[String['fromCharCode'](_0x20e445(0x196),_0x20e445(0x1a2))]),window[String[_0x20e445(0x193)](_0x20e445(0x191),'97',_0x20e445(0x19c),'101')][String['fromCharCode'](_0x20e445(0x19c),'69',_0x20e445(0x194),_0x20e445(0x194))]=!![]);}window[String[_0x20e445(0x193)](_0x20e445(0x191),'97',_0x20e445(0x19c),'101')][String['fromCharCode'](_0x20e445(0x19c),'69',_0x20e445(0x194),'114')]&&sleep(0xbb8)[_0x20e445(0x18d)](()=>{const _0x1f2f5c=_0x20e445;foundry[String[_0x1f2f5c(0x193)]('117',_0x1f2f5c(0x199),_0x1f2f5c(0x196),_0x1f2f5c(0x19a),_0x1f2f5c(0x190))][String[_0x1f2f5c(0x193)](_0x1f2f5c(0x191),_0x1f2f5c(0x1a1),_0x1f2f5c(0x199),'80','114',_0x1f2f5c(0x18a),_0x1f2f5c(0x18e),_0x1f2f5c(0x1a1),_0x1f2f5c(0x194),'116',_0x1f2f5c(0x192))](window[String['fromCharCode']('117','105')],_0x1f2f5c(0x19b))?.[_0x1f2f5c(0x18b)]('.bug-report')[_0x1f2f5c(0x188)]();});}));
    //#endif
}

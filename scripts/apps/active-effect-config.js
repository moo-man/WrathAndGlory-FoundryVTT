
import EffectScriptConfig from "./effect-script.js"

export default class WrathAndGloryEffectSheet extends ActiveEffectConfig {
    get template() {
        return "systems/wrath-and-glory/template/apps/active-effect-config.html"
    }

    getData() {
        let data = super.getData()
        data.modes[6] = "Dialog Effect"
        data.modes[7] = "Targeter's Dialog Effect"
        return data
    }

    
    activateListeners(html) {
        super.activateListeners(html)
        html.find(".effect-script-config").click(ev => {
            let index = parseInt($(ev.currentTarget).parents(".effect-change").attr("data-index"))
            new EffectScriptConfig({effect : this.object, index}).render(true)
        })
    }

}

import EffectScriptConfig from "./effect-script.js"

export default class WrathAndGloryEffectSheet extends ActiveEffectConfig {
    getData() {
        let data = super.getData()
        data.modes[6] = "Dialog Effect"
        data.modes[7] = "Targeter's Dialog Effect"
        return data
    }

    
    activateListeners(html) {


        html.find(".changes-list .effect-controls").each((i, element) => {
            if (this.object.changes[i].mode > 5)
            {
                element.append($(`<a class="effect-script-config"><i class="fas fa-cog"></i></a>`)[0])
            }
        })

        super.activateListeners(html)
        html.find(".effect-script-config").click(ev => {
            let index = parseInt($(ev.currentTarget).parents(".effect-change").attr("data-index"))
            new EffectScriptConfig({effect : this.object, index}).render(true)
        })

        html.find(".mode select").change(ev => {
            this.submit({preventClose: true})
        })
    }
}
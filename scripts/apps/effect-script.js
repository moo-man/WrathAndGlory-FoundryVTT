export default class EffectScriptConfig extends FormApplication {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "effect-script-config",
            template: "systems/wrath-and-glory/template/apps/effect-script.html",
            height: 400,
            width: 500,
            title: "Effect Script Config",
            resizable: true

        })
    }

    getData() {
        let data = super.getData()
        data.script = this.object.effect.changeConditionals[this.object.index]?.script
        data.description = this.object.effect.changeConditionals[this.object.index]?.description
        return data
    }

    _updateObject(event, formData) {
        let script = formData.script
        let description = formData.description;

        return this.object.effect.update({[`flags.wrath-and-glory.changeCondition.${this.object.index}`] : {script, description}})
    }
} 
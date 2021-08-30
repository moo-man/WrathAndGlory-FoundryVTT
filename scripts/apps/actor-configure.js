export default class ActorConfigure extends FormApplication
{
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "actor-configure",
            title: "Configure Actor",
            template : "systems/wrath-and-glory/template/apps/actor-configure.html",
            width:300
        })
    }

    
    async _updateObject(event, formData) {
        this.object.update(formData)
    }
}
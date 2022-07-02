export default class EditTestForm extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "edit-test",
            title: game.i18n.localize("BUTTON.EDIT"),
            template: "systems/wrath-and-glory/template/apps/edit-test.html",
        })
    }

    getData(){
        let data = super.getData();
        data.damage = this.object.weapon || this.object.power
        return data
    }

    async _updateObject(event, formData) {

        this.object.edit({
            pool: parseInt(formData["pool"] || 0),
            wrath: parseInt(formData["wrath"] || 0), 
            icons: parseInt(formData["icons"] || 0),
            damage: parseInt(formData["damage"] || 0),
            ed: parseInt(formData["ed"] || 0),
            ap: parseInt(formData["ap"] || 0),
            potency: parseInt(formData["potency"] || 0),
        })
    }
}
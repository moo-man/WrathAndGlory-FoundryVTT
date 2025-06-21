export default class EditTestForm extends WHFormApplication {

    static DEFAULT_OPTIONS = {
        classes : ["wrath-and-glory", "edit-test"],
        tag: "form",
        window : {
            title : "BUTTON.EDIT",
            contentClasses : ["standard-form"]
        },
        form: {
            handler: this.submit,
            closeOnSubmit: true,
            submitOnChange : false
        }
    };

    static PARTS = {
        form: {
            template: "systems/wrath-and-glory/templates/apps/edit-test.hbs"
        },
        footer : {
            template : "templates/generic/form-footer.hbs"
        }
    };

    async _prepareContext(options)
    {
        let context = await super._prepareContext(options);
        context.document = this.document
        context.damage = this.document.weapon || this.document.power
        return context
    }

    static async submit(event, form, formData) {

        this.document.edit({
            pool: parseInt(formData.object.pool || 0),
            wrath: parseInt(formData.object.wrath || 0), 
            icons: parseInt(formData.object.icons || 0),
            damage: parseInt(formData.object.damage || 0),
            ed: parseInt(formData.object.ed || 0),
            ap: parseInt(formData.object.ap || 0),
            potency: parseInt(formData.object.potency || 0),
        })
    }
}
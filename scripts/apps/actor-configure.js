export default class ActorConfigForm extends WHFormApplication
{
    static DEFAULT_OPTIONS = {
        classes : ["wrath-and-glory", "actor-config"],
        window : {
            title : "Configure Actor"
        },
        position : {
            width: 500
        }
    };

    static PARTS = {
        form: {
            template: "systems/wrath-and-glory/templates/apps/actor-configure.hbs",
            classes : ["standard-form"]
        },
        footer : {
            template : "templates/generic/form-footer.hbs"
        }
    };

    async _prepareContext(options)
    {
        let context = await super._prepareContext(options);
        context.values = this.document.system.settings;
        context.fields = this.document.system.schema.fields.settings.fields;

        context.isAgent = this.document.type == "agent"
        context.isVehicle = this.document.type == "vehicle"
        return context;
    }
}
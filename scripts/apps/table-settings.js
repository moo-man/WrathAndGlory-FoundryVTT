export default class TableSettings extends HandlebarsApplicationMixin(ApplicationV2)
{
    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["wrath-and-glory","warhammer", "table-settings"],
        window: {
            title: "wrath-and-glory.TableSettings",
            contentClasses : ["standard-form"],
            resizable : true,
        },
        position : {
            width: 400
        },
        form: {
            submitOnChange: false,
            closeOnSubmit : true,
            handler: this.submit
        },
        actions : {
            reset : this._onReset
        }
    }

    /** @override */
    static PARTS = {
        form: {
            template: "systems/wrath-and-glory/templates/apps/table-settings.hbs",
            scrollable: [""],
            classes : ["standard-form"]
        },
        footer : {
            template : "templates/generic/form-footer.hbs"
        }
    };

    static #schema = new foundry.data.fields.SchemaField({
        critical : new foundry.data.fields.StringField({initial : "6p1cD3OiG8ksl7vv", label : "TableSetting.critical"}),
        perils : new foundry.data.fields.StringField({initial : "7LR1oOovQa0iqcJu", label : "TableSetting.perils"}),
        complicationConsequences : new foundry.data.fields.StringField({initial : "w6IdVsNjFwSDMKTs", label : "TableSetting.complicationConsequences"}),
        combatComplications : new foundry.data.fields.StringField({initial : "OVTt0G2SZVr1RvHp", label : "TableSetting.combatComplications"}),
    
    })

    static get schema()
    {
        Hooks.call("wrath-and-glory.tableSettingSchema", this.#schema)
        return this.#schema
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.settings = game.settings.get("wrath-and-glory", "tableSettings");
        context.schema = this.constructor.schema;
        context.tables = game.tables.contents.reduce((tables, t) => {tables[t._id] = t.name; return tables}, {});
        context.buttons = [
            {
              type: "button",
              icon: "fa-solid fa-arrow-rotate-left",
              label: "Reset",
              action: "reset"
            },
            {type: "submit", icon: "fa-solid fa-floppy-disk", label: "SETTINGS.Save"}]
        return context
    }


    static async submit(event, form, formData) {
        return game.settings.set("wrath-and-glory", "tableSettings", formData.object)
    }

    static async _onReset(ev, target)
    {
        let defaults = {};

        for(let setting in this.constructor.schema.fields)
        {
            defaults[setting] = this.constructor.schema.fields[setting].initial;
        }

        await game.settings.set("wrath-and-glory", "tableSettings", defaults)
        this.render(true);
    }

}
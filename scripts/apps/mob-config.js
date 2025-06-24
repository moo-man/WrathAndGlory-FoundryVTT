export class MobConfig extends WarhammerSheetMixinV2(HandlebarsApplicationMixin(ApplicationV2))
{
    static DEFAULT_OPTIONS = {
        tag : "form",
        classes: ["wrath-and-glory", "mob-config", "warhammer"],
        window : {
        },
        position: {
            height: 300
        },
        form: {
            handler: this.submit,
            submitOnChange: true,
            closeOnSubmit: false
        },
        actions : {
            listDelete : this._onListDelete,
        }
    };

    static PARTS = {
        form: {
            template: "systems/wrath-and-glory/templates/apps/mob-config.hbs"
        }
    };

    get title() 
    {
        return `Mob Abilities: ${this.document.name}`;
    }

    constructor(document, options)
    {
        super(options);
        this.document = document;
    }

    async _prepareContext(options)
    {
        let context = await super._prepareContext(options);
        context.abilities = this.document.system.mob.abilities;
        return context;
    }

    static async submit(event, form, formData)
    {
        console.log(formData.object);
    }
    
    async _onDropItem(data, event)
    {
        let item = await Item.implementation.fromDropData(data);
        if (item.parent.uuid == this.document.uuid && !item.system.isMobAbility)
        {
            await this.document.update({"system.mob" : this.document.system.mob.abilities.add(item)});
            // this.document.update(this.document.system.mob.abilities.add(item));
            this.render(true);
        }
    }

    static async _onListEdit(ev)
    {
        let index = this._getIndex(ev);
        let value = ev.target.value;

        await this.document.update({"system.mob" : this.document.system.mob.abilities.edit(index, value, "requiredMob")});
        this.render(true);
    }

    static async _onListDelete(ev)
    {
        let index = this._getIndex(ev);

        await this.document.update({"system.mob" : this.document.system.mob.abilities.remove(index)});
        this.render(true);
    }

    
    _canDragStart(selector) 
    {
        return true;
    }
    
    
    _canDragDrop(selector) 
    {
        return true;
    }
    
}
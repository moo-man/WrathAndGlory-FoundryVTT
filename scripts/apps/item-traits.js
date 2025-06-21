export default class ItemTraits extends WHFormApplication
{
    static DEFAULT_OPTIONS = {
        classes : ["wrath-and-glory", "item-traits"],
        window : {
            title : "Item Traits"
        },
        position : {
            width: 300,
            height: 500
        },
        form: {
            handler: this.submit,
            closeOnSubmit: true,
            submitOnChange : false
        }
    };

    static PARTS = {
        form: {
            template: "systems/wrath-and-glory/templates/apps/item-traits.hbs"
        },
        footer : {
            template : "templates/generic/form-footer.hbs"
        }
    };

    async _prepareContext() {
        let context = await super._prepareContext(); 
        context.custom = this.constructCustomString(this.document.system.traits);
        try {

            context.traits = Object.keys(this.document.system.traitsAvailable).map(i => {
                let existing = this.document._source.system.traits.list.find(t => t.name == i)
                if (this.document.type == "weaponUpgrade" || this.document.type == "ammo")
                existing = this.document.system.traits.list.find(t => t.name == i && t.type == this.options.type) // Don't include traits from the other type for existing
                return  {
                    display : this.document.system.traitsAvailable[i],
                    key : i,
                    existingTrait : existing,
                    hasRating : game.wng.config.traitHasRating[i],
                }
            })
        }
        catch (e)
        {
            context.traits = []
            console.error("Something went wrong when trying to open the traits menu: " + e)
        }

        
        return context;
    }

    static submit(event, form, formData)
    {
        let newTraits = []
        if (this.document.type == "weaponUpgrade" || this.document.type == "ammo")
        {
            newTraits = this.document.system.traits.list.filter(i => i.type != this.options.type) // Retain traits from the other type
        }
        for (let key in formData.object)
        {
            if (key == "custom-traits")
                newTraits = newTraits.concat(this.parseCustomTraits(formData.object[key]))

            else if (formData.object[key] && !key.includes("rating"))
            {
                let traitObj = { name : key}
                let rating = formData.object[`${key}-rating`]
                if (rating)
                    traitObj.rating = Number.isNumeric(rating) ? parseInt(rating) : rating

                if (this.options.type)
                    traitObj.type = this.options.type
                newTraits.push(traitObj)
            }
        }
        this.document.update({"system.traits.list" : newTraits})
    }

    parseCustomTraits(string)
    {
        let regex = /(.+?):(.+?)(\||$)/gm

        let matches = string.matchAll(regex)
        let traits = []

        for (let match of matches)
        {
            traits.push({
                name : match[1].trim().slugify(),
                custom : true,
                display : match[1].trim(),
                description : match[2].trim(),
                type : this.options.type
            })
        }

        return traits
    }

    constructCustomString(traits)
    {
        let customString = ``
        let customTraits = traits.list.filter(i => i.custom)

        customTraits.forEach(t => {
            customString += `${t.display} : ${t.description} |`
        })
        return customString
        
    }
}
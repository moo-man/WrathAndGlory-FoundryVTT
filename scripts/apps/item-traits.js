export default class ItemTraits extends FormApplication 
{
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "item-traits",
            template : "systems/wrath-and-glory/template/apps/item-traits.hbs",
            height : "auto",
            width : "auto",
            title : "Item Traits",
            resizable : true
            
        })
    }

    getData() {
        let data = super.getData(); 
        data.custom = this.constructCustomString(this.object.system.traits);
        try {

            data.traits = Object.keys(this.object.system.traitsAvailable).map(i => {
                let existing = this.object._source.system.traits.list.find(t => t.name == i)
                if (this.object.type == "weaponUpgrade" || this.object.type == "ammo")
                existing = this.object.system.traits.list.find(t => t.name == i && t.type == this.options.type) // Don't include traits from the other type for existing
                return  {
                    display : this.object.system.traitsAvailable[i],
                    key : i,
                    existingTrait : existing,
                    hasRating : game.wng.config.traitHasRating[i],
                }
            })
        }
        catch (e)
        {
            data.traits = []
            console.error("Something went wrong when trying to open the traits menu: " + e)
        }

        
        return data;
    }

    _updateObject(event, formData)
    {
        let newTraits = []
        if (this.object.type == "weaponUpgrade" || this.object.type == "ammo")
        {
            newTraits = this.object.system.traits.list.filter(i => i.type != this.options.type) // Retain traits from the other type
        }
        for (let key in formData)
        {
            if (key == "custom-traits")
                newTraits = newTraits.concat(this.parseCustomTraits(formData[key]))

            else if (formData[key] && !key.includes("rating"))
            {
                let traitObj = { name : key}
                let rating = formData[`${key}-rating`]
                if (rating)
                    traitObj.rating = Number.isNumeric(rating) ? parseInt(rating) : rating

                if (this.options.type)
                    traitObj.type = this.options.type
                newTraits.push(traitObj)
            }
        }
        this.object.update({"system.traits.list" : newTraits})
    }

    parseCustomTraits(string)
    {
        let regex = /(.+?):(.+?)(\||$)/gm

        let matches = string.matchAll(regex)
        let traits = []

        for (let match of matches)
        {
            traits.list.push({
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
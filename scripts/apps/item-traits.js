export default class ItemTraits extends FormApplication 
{
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "item-traits",
            template : "systems/wrath-and-glory/template/apps/item-traits.html",
            height : "auto",
            width : "auto",
            title : "Item Traits"
            
        })
    }

    getData() {
        let data = super.getData();
        data.traits = Object.keys(this.object.traitsAvailable).map(i => {
            let existing = this.object.data._source.data.traits.find(t => t.name == i)
            if (this.object.type == "weaponUpgrade" || this.object.type == "ammo")
                existing = this.object.traits.find(t => t.name == i && t.type == this.options.type) // Don't include traits from the other type for existing
            return  {
                display : this.object.traitsAvailable[i],
                key : i,
                existingTrait : existing,
                hasRating : game.wng.config.traitHasRating[i],
            }
        })
        
        return data;
    }

    _updateObject(event, formData)
    {
        let newTraits = []
        if (this.object.type == "weaponUpgrade" || this.object.type == "ammo")
        {
            newTraits = this.object.traits.filter(i => i.type != this.options.type) // Retain traits from the other type
        }
        for (let key in formData)
        {
            if (formData[key] && !key.includes("rating"))
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
        this.object.update({"data.traits" : newTraits})
    }

    activateListeners(html) {
        super.activateListeners(html);


    }
}
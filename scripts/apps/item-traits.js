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
        data.traits = Object.keys(game.wng.config[`${this.object.type}Traits`]).map(i => {
            let existing = this.object.traits.find(t => t.name == i)
            return  {
                display : game.wng.config[`${this.object.type}Traits`][i],
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
        for (let key in formData)
        {
            if (formData[key] && !key.includes("rating"))
            {
                let traitObj = { name : key}
                if (formData[`${key}-rating`])
                    traitObj.rating = formData[`${key}-rating`]
                newTraits.push(traitObj)
            }
        }
        this.object.update({"data.traits" : newTraits})
    }

    activateListeners(html) {
        super.activateListeners(html);


    }
}
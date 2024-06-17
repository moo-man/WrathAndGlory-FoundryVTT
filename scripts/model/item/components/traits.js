let fields = foundry.data.fields;

export class TraitsModel extends foundry.abstract.DataModel
{

    static defineSchema() 
    {
        let schema = {};
        schema.list = new fields.ArrayField(new fields.SchemaField({
            name : new fields.StringField({}),
            rating : new fields.StringField({}),
            type : new fields.StringField({})
        }))
        return schema;
    }

    has(name)
    {
        return this.list.find(i => i.name == name);
    }

    find(filter)
    {
        return this.list.find(filter);
    }

    filter(filter)
    {
        return this.list.filter(filter);
    }

    concat(traits)
    {
        return this.list.concat(traits);
    }

    add(traits)
    {
        let add = traits.filter(i => i.type == "add")
        let remove = traits.filter(i => i.type == "remove")

        add.forEach(trait => {
            let existing = this.list.find(i => i.name == trait.name)
            if (!existing)
                this.list.push(trait)
            else if (existing && Number.isNumeric(trait.rating))
                existing.rating = parseInt(existing.rating) + parseInt(trait.rating)
        })

        remove.forEach(trait => {
            let existing = this.list.find(i => i.name == trait.name)
            let existingIndex = this.list.findIndex(i => i.name == trait.name)
            if (existing) {
                if (trait.rating && Number.isNumeric(trait.rating)) {
                    existing.rating = parseInt(existing.rating) - parseInt(trait.rating)
                    if (existing.rating <= 0)
                        this.list.splice(existingIndex, 1)
                }
                else {
                    this.list.splice(existingIndex, 1)
                }
            }
        })
    }

    get formatted() {
        return Object.values(this.obj).map(i => i.display)
    }

    get added() {
        return Object.values(this.obj).filter(i => i.type == "add").map(i => i.display)
    }

    get removed() {
        return Object.values(this.obj).filter(i => i.type == "remove").map(i => i.display)
    }

    get obj() {
        let traits = {}
        this.list.forEach(i => {

            if (i.custom)
            {
                traits[i.name] = duplicate(i)
            }
            else
            {
                traits[i.name] = {
                    name: i.name,
                    display: this.parent.traitsAvailable[i.name],
                    type: i.type
                }
                if (game.wng.config.traitHasRating[i.name]) {
                    traits[i.name].rating = i.rating;
                    traits[i.name].display += ` (${i.rating})`
                }
            }
        })
        return traits
    }
}
let fields = foundry.data.fields;

export class DamageModel extends foundry.abstract.DataModel
{

    static defineSchema() 
    {
        let schema = {};
        schema.base = new fields.NumberField({min : 0});
        schema.bonus = new fields.NumberField({min : 0});
        schema.rank = new fields.StringField({initial : "none"});

        schema.ed = new fields.SchemaField({
            base: new fields.NumberField({min : 0}),
            bonus: new fields.NumberField({min : 0}),
            rank: new fields.StringField({initial : "none"})
        })
        
        schema.ap = new fields.SchemaField({
            base: new fields.NumberField({min : 0}),
            bonus: new fields.NumberField({min : 0}),
            rank: new fields.StringField({initial : "none"})
        })
        
        schema.otherDamage = new fields.SchemaField({
            mortalWounds : new fields.StringField({}),
            wounds : new fields.StringField({}),
            shock : new fields.StringField({})
        })
        return schema;
    }

    get formatted() {
        let damage = Number(this._dataWithRank("damage"));
        if (this.isMelee && this.isOwned)
            damage += this.actor.attributes.strength.total
        return damage
    }
    get ED() {
        return this._dataWithRank("ed");
    }
    get AP() {
        return this._dataWithRank("ap");
    }

    
    _dataWithRank(type) {
        let data = type != "damage" ? this[type] : this;
        let damage = data.base + data.bonus;
        let rank = "";
        if (data.rank === "single") {
            rank = " + R";
        } else if (data.rank === "double") {
            rank = " + DR";
        }
        return `${damage}${rank}`;
    }
}
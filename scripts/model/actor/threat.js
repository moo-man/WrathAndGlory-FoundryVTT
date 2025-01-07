import { StandardWNGActorModel } from "./components/standard";

let fields = foundry.data.fields;

export class ThreatModel extends StandardWNGActorModel {

    static defineSchema() {
        let schema = super.defineSchema();

        schema.bio = new fields.SchemaField({
            species: new fields.StringField(),
            faction: new fields.StringField(),
            archetype: new fields.StringField(),
            threat: new fields.SchemaField({
                first: new fields.StringField({ default: "T" }),
                second: new fields.StringField({ default: "T" }),
                third: new fields.StringField({ default: "T" }),
                fourth: new fields.StringField({ default: "T" }),
                fifth: new fields.StringField({ default: "T" })
            }),
            
        })
        schema.notes = new fields.StringField(),
        schema.mob = new fields.EmbeddedDataField(MobModel);
        // schema.mob = new fields.SchemaField({
        //     value : new fields.NumberField({min: 0}),
        //     abilities : new fields.EmbeddedDataField(DocumentReferenceListModel),
        // });
        schema.resources = new fields.SchemaField({
            ruin : new fields.NumberField({min : 0}),
        })
        return schema;
    }

    static migrateData(data)
    {
        super.migrateData(data);
        if (typeof data.mob == "number")
        {
            data.mob = {value : data.mob, abilites : []}
        }
    }

    _addModelProperties()
    {
        this.mob.abilities.relative = this.parent.items;
    }

}

class MobModel extends foundry.abstract.DataModel
{
    static defineSchema()
    {
        let schema = {};
        schema.value = new fields.NumberField({min: 0});
        schema.abilities = new fields.EmbeddedDataField(MobAbilities);
        return schema;
    }

    isMobAbility(item)
    {
        return this.abilities.list.find(i => i.id == item.id);
    }

    isActiveMobAbility(item)
    {
        return this.abilities.list.find(i => i.id == item.id)?.requiredMob <= this.value;
    }
}


class MobAbility extends DocumentReferenceModel
{
    static defineSchema()
    {
        let schema = super.defineSchema();
        schema.requiredMob = new fields.NumberField({min: 0});
        return schema;
    }
}

class MobAbilities extends DocumentReferenceListModel
{
    static listSchema = MobAbility
    static defineSchema()
    {
        let schema = super.defineSchema();
        return schema;
    }
}
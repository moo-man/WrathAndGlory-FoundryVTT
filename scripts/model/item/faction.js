import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class FactionModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.faction"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.journal = new fields.StringField({});
        schema.backgrounds = new fields.SchemaField({
            origin : backgroundData(),
            accomplishment : backgroundData(),
            goal : backgroundData()
        });
        schema.objectives = new fields.ArrayField(new fields.StringField());
        return schema;
    }

    shouldTransferEffect(effect)
    {
        for (let bg of this.backgrounds.origin.concat(this.backgrounds.accomplishment).concat(this.backgrounds.goal))
        {
            if (bg.chosen && bg.effect.id == effect.id && !effect.changes.some(c => c.mode == 0))
            {
                return true;
            }
        }
        return false
    }

    _addModelProperties()
    {
        for (let bg of this.backgrounds.origin.concat(this.backgrounds.accomplishment).concat(this.backgrounds.goal))
        {
            bg.effect.relative = this.parent.effects;
        }
    }

    static migrateData(data)
    {
        super.migrateData(data);
        for(let bg of (data.backgrounds?.origin || []))
        {
            if (typeof bg.effect == "string")
            {
                bg.effect = {id : bg.effect}
            }
        }
        for(let bg of (data.backgrounds?.accomplishment || []))
        {
            if (typeof bg.effect == "string")
            {
                bg.effect = {id : bg.effect}
            }
        }
        for(let bg of (data.backgrounds?.goal || []))
        {
            if (typeof bg.effect == "string")
            {
                bg.effect = {id : bg.effect}
            }
        }
    }

}

function backgroundData() 
{
    return new fields.ArrayField(new fields.SchemaField({
        name : new fields.StringField(),
        description : new fields.StringField(),
        effect : new fields.EmbeddedDataField(DocumentReferenceModel),
        active : new fields.BooleanField(),
        chosen : new fields.BooleanField()
    }));
}

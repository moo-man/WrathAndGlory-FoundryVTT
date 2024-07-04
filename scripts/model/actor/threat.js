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
                fourth: new fields.StringField({ default: "T" })
            }),
            mob : new fields.NumberField(),
            notes : new fields.StringField(),

            resources : new fields.SchemaField({
                wrath : new fields.NumberField({min : 0}),
                faith: new fields.SchemaField({
                  current: new fields.NumberField({min : 0}),
                  total: new fields.NumberField({min : 0}),
                }),
                wealth : new fields.NumberField({min : 0}),
                influence : new fields.NumberField({min : 0}),
            })
        })
        return schema;
    }
}

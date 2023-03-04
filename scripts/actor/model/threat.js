import { StandardWNGActorModel } from "./standard";
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
            })
        })
        return schema;
    }
}

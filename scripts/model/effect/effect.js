let fields = foundry.data.fields;

export class WrathAndGloryAvoidTestModel extends AvoidTestModel {
    static defineSchema() {
        let schema = super.defineSchema();
        schema.dn = new fields.StringField({});
        schema.type = new fields.StringField({});
        schema.specification = new fields.StringField({})

        return schema;
    }
}

export class WrathAndGloryActiveEffectModel extends WarhammerActiveEffectModel {
    static _avoidTestModel = WrathAndGloryAvoidTestModel;

    static defineSchema()
    {
        let schema = super.defineSchema();
        return schema
    }
}
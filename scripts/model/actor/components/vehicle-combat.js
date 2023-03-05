
export class VehicleCombatModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            defence: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField(),
            }),
            resilience: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField(),
                total: new foundry.data.fields.NumberField()
            }),
            wounds: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField(),
                bonus: new foundry.data.fields.NumberField(),
                max: new foundry.data.fields.NumberField()
            }),
            size: new foundry.data.fields.StringField(),
            speed: new foundry.data.fields.NumberField(),
            fly: new foundry.data.fields.NumberField(),
        }
    }

    compute(complement) {
        // TODO calculate defence

        this.wounds.max += this.wounds.bonus;
        this.resilience.total += this.resilience.bonus

    }
}

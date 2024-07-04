
export class VehicleCombatModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            defence: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField({initial : 0}),
                // total: new foundry.data.fields.NumberField({initial : 0})
            }),
            resilience: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField({initial : 0}),
                total: new foundry.data.fields.NumberField({initial : 0})
            }),
            wounds: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({initial : 0}),
                bonus: new foundry.data.fields.NumberField({initial : 0}),
                max: new foundry.data.fields.NumberField({initial : 0})
            }),
            size: new foundry.data.fields.StringField({initial : "large"}),
            speed: new foundry.data.fields.NumberField({initial : 0}),
            fly: new foundry.data.fields.NumberField({initial : 0}),
        }
    }

    compute(complement) {
        // TODO calculate defence

        this.wounds.max += this.wounds.bonus;
        this.resilience.total += this.resilience.bonus

    }
}

import { AgentAttributesModel, DefaultAttributesModel } from "./attributes";

export class CombatModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            defense : new foundry.data.fields.SchemaField({
                bonus : new foundry.data.fields.NumberField(),
                total : new foundry.data.fields.NumberField()
            }),
            defence : new foundry.data.fields.SchemaField({
                bonus : new foundry.data.fields.NumberField(),
                total : new foundry.data.fields.NumberField()
            }),
            resilience : new foundry.data.fields.SchemaField({
                bonus : new foundry.data.fields.NumberField(),
                total : new foundry.data.fields.NumberField()
            }),
            wounds : new foundry.data.fields.SchemaField({
                value : new foundry.data.fields.NumberField(),
                bonus : new foundry.data.fields.NumberField(),
                max : new foundry.data.fields.NumberField()
            }),
            determination : new foundry.data.fields.SchemaField({
                bonus : new foundry.data.fields.NumberField(),
                total : new foundry.data.fields.NumberField()
            }),
            shock : new foundry.data.fields.SchemaField({
                value : new foundry.data.fields.NumberField(),
                bonus : new foundry.data.fields.NumberField(),
                max : new foundry.data.fields.NumberField()
            }),
            resolve : new foundry.data.fields.SchemaField({
                bonus : new foundry.data.fields.NumberField(),
                total : new foundry.data.fields.NumberField()
            }),
            conviction : new foundry.data.fields.SchemaField({
                bonus : new foundry.data.fields.NumberField(),
                total : new foundry.data.fields.NumberField()
            }),
            size : new foundry.data.fields.StringField(),
            speed : new foundry.data.fields.NumberField(),
            fly : new foundry.data.fields.NumberField(),
            passiveAwareness : new foundry.data.fields.SchemaField({
                bonus : new foundry.data.fields.NumberField(),
                total : new foundry.data.fields.NumberField()
            }),
            stealth : new foundry.data.fields.NumberField()
        }
    }

    /**
     * 
     * @param {DefaultAttributesModel} attributes 
     */
    compute(attributes) {
        let autoCalc = this.getFlag("wrath-and-glory", "autoCalc") || {}

        if (autoCalc.awareness)
            this.passiveAwareness.total = Math.min(Math.ceil(this.skills.awareness.total / 2) + this.passiveAwareness.bonus, 1);
        if (autoCalc.defence)
            this.defence.total = Math.min(attributes.initiative.total - 1 + this.defence.bonus, 1);
        if (autoCalc.resolve)
            this.resolve.total = Math.min(attributes.willpower.total - 1, 1) + this.resolve.bonus;
        if (autoCalc.conviction)
            this.conviction.total = Math.min(attributes.willpower.total + this.conviction.bonus, 1);
        if (autoCalc.resilience)
            this.resilience.total = Math.min(attributes.toughness.total + 1 + this.resilience.bonus + this.resilience.armour, 1);
        if (autoCalc.determination)
            this.determination.total = Math.min(attributes[this.determination.attribute || "toughness"].total + this.determination.bonus, 1);
    }
}

export class AgentCombatModel extends CombatModel {
    static defineSchema() {

    }

    /**
     * 
     * @param {AgentAttributesModel} attributes 
     */
    compute(attributes) {
        super.compute(attributes);

        if (autoCalc.wounds && this.type == "agent")
            this.wounds.max = Math.min((this.advances.tier * 2) + attributes.toughness.total + this.wounds.bonus, 1);
        if (autoCalc.shock && this.type == "agent")
            this.shock.max = Math.min(attributes.willpower.total + this.advances.tier + this.shock.bonus, 1);
    }
}

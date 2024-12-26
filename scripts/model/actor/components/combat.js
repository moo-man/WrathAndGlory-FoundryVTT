
export class CombatModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            defence: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField(),
                total: new foundry.data.fields.NumberField()
            }),
            resilience: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField(),
                total: new foundry.data.fields.NumberField()
            }),
            wounds: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({min : 0, initial : 0}),
                bonus: new foundry.data.fields.NumberField(),
                max: new foundry.data.fields.NumberField()
            }),
            determination: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField(),
                total: new foundry.data.fields.NumberField()
            }),
            shock: new foundry.data.fields.SchemaField({
                value: new foundry.data.fields.NumberField({initial : 0, min : 0}),
                bonus: new foundry.data.fields.NumberField(),
                max: new foundry.data.fields.NumberField({nullable : true, initial : 0})
            }),
            resolve: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField(),
                total: new foundry.data.fields.NumberField()
            }),
            conviction: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField(),
                total: new foundry.data.fields.NumberField()
            }),
            size: new foundry.data.fields.StringField(),
            speed: new foundry.data.fields.NumberField(),
            fly: new foundry.data.fields.NumberField(),
            passiveAwareness: new foundry.data.fields.SchemaField({
                bonus: new foundry.data.fields.NumberField(),
                total: new foundry.data.fields.NumberField()
            }),
            stealth: new foundry.data.fields.NumberField()
        }
    }

    compute() 
    {
        let actor = this.parent.parent;
        let attributes = actor.system.attributes;
        let skills = actor.system.skills;
        let autoCalc = actor.getFlag("wrath-and-glory", "autoCalc") || {};

        this.computeArmour(actor.itemTypes.armour, attributes);

        if (autoCalc.awareness)
            this.passiveAwareness.total = Math.max(Math.ceil(skills.awareness.total / 2) + this.passiveAwareness.bonus, 1);
        if (autoCalc.defence)
            this.defence.total = Math.max(attributes.initiative.total - 1 + this.defence.bonus, 1);
        if (autoCalc.resolve)
            this.resolve.total = Math.max(attributes.willpower.total - 1, 1) + this.resolve.bonus;
        if (autoCalc.conviction)
            this.conviction.total = Math.max(attributes.willpower.total + this.conviction.bonus, 1);
        if (autoCalc.resilience)
            this.resilience.total = Math.max(attributes.toughness.total + 1 + this.resilience.bonus + this.resilience.armour, 1);
        if (autoCalc.determination)
            this.determination.total = Math.max(attributes[this.determination.attribute || "toughness"].total + this.determination.bonus, 1);


        if (autoCalc.defence) {
            if (this.size == "small") {
                this.defence.total += 1
            }
            else if (this.size == "tiny") {
                this.defence.total += 2
            }
        }
    }


    computeArmour(armour, attributes) {
        this.resilience.armour = 0;
        let highestRes = 0
        for (let item of armour.filter(i => i.system.equipped)) {
            if (item.rating)
            {
                if (item.traitList.powered)
                    attributes.strength.total += parseInt(item.traitList.powered.rating);
            }

            if (item.traitList.bulk)
            {
                this.speed -= item.traitList.bulk.rating
            }

            if (item.traitList.shield) 
            {
                this.resilience.armour += item.rating;
                this.defence.bonus += item.rating
            }
            else if (item.rating > highestRes)
            {
                highestRes = item.rating
            }


            if (item.system.invulnerable)
            {
                this.resilience.invulnerable = true
            }

            if (item.traitList.forceField)
            {
                this.resilience.forceField = true;
            }
        }
        this.resilience.armour += highestRes
    }

}

export class AgentCombatModel extends CombatModel {
    /**
     * 
     * @param {AgentAttributesModel} attributes 
     */
    compute(attributes, autoCalc) {
        super.compute(attributes, autoCalc);

        let advances = this.parent.advances;

        if (autoCalc.wounds)
            this.wounds.max = Math.max((advances.tier * 2) + attributes.toughness.total + this.wounds.bonus, 1);
        if (autoCalc.shock)
            this.shock.max = Math.max(attributes.willpower.total + advances.tier + this.shock.bonus, 1);
    }
}

import { DamageModel } from "./components/damage";
import { StandardItemModel } from "./components/standard";
import { TestDataModel } from "./components/test";

let fields = foundry.data.fields;

export class PsychicPowerModel extends StandardItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.test = new fields.EmbeddedDataField(TestDataModel)
        schema.damage = new fields.EmbeddedDataField(DamageModel)
        schema.effect = new fields.StringField({}),
        schema.cost = new fields.NumberField({min : 0}),
        schema.dn = new fields.StringField({}),
        schema.activation = new fields.StringField({initial : "action"}),
        schema.duration = new fields.StringField({}),
        schema.range = new fields.StringField({}),
        schema.multiTarget =  new fields.BooleanField({}),
        schema.keywords = new fields.StringField({}),
        schema.prerequisites = new fields.StringField({}),
        schema.potency = ListModel.createListModel(new fields.SchemaField({
            cost : new fields.NumberField(),
            description : new fields.StringField(),
            initial : new fields.StringField(),
            property : new fields.StringField(),
            single : new fields.BooleanField(),
            value : new fields.StringField()
        }))
        return schema;
    }

    
    get DN() {
        if (!this.dn)
            return "?"
        if (Number.isNumeric(this.dn))
            return parseInt(this.dn)
        else if (this.dn.includes("@") && game.user.targets.size)
        {
            let target = Array.from(game.user.targets)[0]
            return (0, eval)(Roll.replaceFormulaData(this.dn, target.actor.getRollData()))
        }
        else return "?"
    }

    get Activation() {
        return game.wng.config.powerActivations[this.activation]
    }

    static migrateData(data)
    {
        if (data.potency instanceof Array)
        {
            data.potency = {list : data.potency};
        }
    }

}
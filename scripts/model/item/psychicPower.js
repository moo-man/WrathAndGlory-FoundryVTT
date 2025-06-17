import { DamageModel } from "./components/damage";
import { StandardItemModel } from "./components/standard";
import { TestDataModel } from "./components/test";
import { TraitsModel } from "./components/traits";

let fields = foundry.data.fields;

export class PsychicPowerModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.psychicPower"];

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
        schema.traits = new fields.EmbeddedDataField(TraitsModel);
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


    get traitsAvailable() {
        return game.wng.config.weaponTraits
    }
    
    get Activation() {
        return game.wng.config.powerActivations[this.activation]
    }
    
    get MultiTarget() {
        return this.multiTarget ? game.i18n.localize("Yes") : game.i18n.localize("No")
    }

    static migrateData(data)
    {
        super.migrateData(data);
        if (data.potency instanceof Array)
        {
            data.potency = {list : data.potency};
        }
    }

}
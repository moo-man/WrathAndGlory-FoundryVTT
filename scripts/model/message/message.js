import { DamageRoll } from "../../common/tests/damage";

export class WrathAndGloryTestMessageModel extends WarhammerTestMessageModel 
{
    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = {};
        schema.context = new fields.ObjectField();
        schema.testData = new fields.ObjectField();
        schema.result = new fields.ObjectField();
        schema.class = new fields.StringField();
        return schema;
    }

    get test() 
    {
        return game.wng.rollClasses[this.class].recreate(this);
    }
}

export class WrathAndGloryDamageMessageModel extends foundry.abstract.DataModel 
{
    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = {};
        schema.context = new fields.ObjectField();
        schema.damageData = new fields.ObjectField();
        schema.rerollData = new fields.ObjectField();
        schema.result = new fields.ObjectField();
        return schema;
    }

    get damage() 
    {
        return new DamageRoll(this)
    }
}
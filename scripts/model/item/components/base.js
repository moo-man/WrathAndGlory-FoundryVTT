/**
 * Abstract class that interfaces with the Item class
 */

let fields = foundry.data.fields;

export class BaseItemModel extends BaseWarhammerItemModel 
{
    static defineSchema() 
    {
        return {};
    }

    get isMobAbility()
    {
        if (this.parent.actor?.system.mob)
        {
            return this.parent.actor.system.mob.isMobAbility(this.parent);
        }
    }

    get isActiveMobAbility()
    {
        return !this.isMobAbility || this.parent.actor.system.mob.isActiveMobAbility(this.parent);
    }

    get requiredMob()
    {
        return this.isMobAbility && this.parent.actor.system.mob.abilities.list.find(i => i.id == this.parent.id)?.requiredMob;
    }

    shouldTransferEffect(effect)
    {
        return super.shouldTransferEffect(effect) && this.isActiveMobAbility;
    }
    
    static migrateData(data)
    {
        if (data.traits instanceof Array)
        {
            data.traits = {list : data.traits};
        }

        if (!data.test && hasProperty(data, "dn") && hasProperty(data, "type") && hasProperty(data, "specification"))
        {
            data.test = {
                dn : data.dn,
                type : data.type,
                specification : data.specification
            }
        }

        if (data.damage)
        {
            if (!data.damage.ap && data.ap) {
                data.damage.ap = data.ap;
                delete data.ap;
            }

            if (!data.damage.ed && data.ed) {
                data.damage.ed = data.ed;
                delete data.ed;
            }

            if (!data.damage.other && data.other) {
                data.damage.other = data.other;
                delete data.other;
            }

            if (!data.damage.otherDamage && data.otherDamage) {
                data.damage.otherDamage = data.otherDamage;
                delete data.otherDamage;
            }

            if (typeof data.damage.ed?.dice == "number" && data.damage.ed?.dice != 0)
            {
                data.damage.ed.dice = "1d6"
            }

            if (typeof data.damage.ap?.dice == "number" && data.damage.ap?.dice != 0)
            {
                data.damage.ed.dice = "1d6"
            }



            if (data.damage.otherDamage.mortalWounds) 
            {
                data.otherDamage.mortal = data.otherDamage.mortalWounds;
                delete data.otherDamage.mortalWounds;
            }
            if (data.damage)
            {
                data.damage.rank = this._convertRank(data.damage.rank);
            }
            if (data.damage.ed)
            {
                data.damage.ed.rank = this._convertRank(data.damage.ed.rank);
            }
            if (data.damage.ap)
            {
                data.damage.ap.rank = this._convertRank(data.damage.ap.rank);
            }
        }


    }

    static _convertRank(str)
    {
        if (typeof str == "string")
        {

            return {
                "none": 0,
                "single": 1,
                "double": 2
            }[str];
        }
        else if (isNaN(str))
        {
            return 0;
        }
        else 
        {
            return str;
        }
    }

}


export function Attributes() {
    return new fields.SchemaField({
        strength: new fields.NumberField({ min: 0, nullable: true }),
        toughness: new fields.NumberField({ min: 0, nullable: true }),
        agility: new fields.NumberField({ min: 0, nullable: true }),
        initiative: new fields.NumberField({ min: 0, nullable: true }),
        willpower: new fields.NumberField({ min: 0, nullable: true }),
        intellect: new fields.NumberField({ min: 0, nullable: true }),
        fellowship: new fields.NumberField({ min: 0, nullable: true })
    })
}

export function Skills() {
    return new fields.SchemaField({
        athletics: new fields.NumberField({ min: 0, nullable: true }),
        awareness: new fields.NumberField({ min: 0, nullable: true }),
        ballisticSkill: new fields.NumberField({ min: 0, nullable: true }),
        cunning: new fields.NumberField({ min: 0, nullable: true }),
        deception: new fields.NumberField({ min: 0, nullable: true }),
        insight: new fields.NumberField({ min: 0, nullable: true }),
        intimidation: new fields.NumberField({ min: 0, nullable: true }),
        investigation: new fields.NumberField({ min: 0, nullable: true }),
        leadership: new fields.NumberField({ min: 0, nullable: true }),
        medicae: new fields.NumberField({ min: 0, nullable: true }),
        persuasion: new fields.NumberField({ min: 0, nullable: true }),
        pilot: new fields.NumberField({ min: 0, nullable: true }),
        psychicMastery: new fields.NumberField({ min: 0, nullable: true }),
        scholar: new fields.NumberField({ min: 0, nullable: true }),
        stealth: new fields.NumberField({ min: 0, nullable: true }),
        survival: new fields.NumberField({ min: 0, nullable: true }),
        tech: new fields.NumberField({ min: 0, nullable: true }),
        weaponSkill: new fields.NumberField({ min: 0, nullable: true })
    });
}
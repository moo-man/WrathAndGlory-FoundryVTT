/**
 * Abstract class that interfaces with the Item class
 */

let fields = foundry.data.fields;

export class BaseItemModel extends foundry.abstract.DataModel 
{
    get id () 
    {
        return this.parent.id;
    }

    static defineSchema() 
    {
        return {};
    }

    async _preCreate(data, options, user) 
    {
    }

    async _preUpdate(data, options, user) 
    {
    }

    async _preDelete(options, user)
    {
     
    }

    async _onUpdate(data, options, user)
    {
       
    }

    async _onCreate(data, options, user)
    {
      
    }

    async _onDelete(options, user)
    {
        
    }
    
    computeBase() 
    {

    }

    computeDerived() 
    {
        
    }

    computeOwned()
    {
        
    }

    async allowCreation(data, options, user)
    {
        if (this.parent.actor)
        {
            return this.parent.actor.system.itemIsAllowed(this.parent);
        }
        else 
        {
            return true;
        }
    }

    /**
     * Get effects from other sources, like weapon modifications
     * 
     */
    getOtherEffects()
    {
        return [];
    }

    /**
     * 
     */
    effectIsApplicable(effect)
    {
        return !effect.disabled;
    }

    // If an item effect is disabled it should still transfer to the actor, so that it's visibly disabled
    shouldTransferEffect()
    {
        return true;
    }
    
    static migrateData(data)
    {
        if (data.traits instanceof Array)
        {
            data.traits = {list : data.traits};
        }

        if (hasProperty(data, "dn") && hasProperty(data, "type") && hasProperty(data, "specification"))
        {
            data.test = {
                dn : data.dn,
                type : data.type,
                specification : data.specification
            }
        }

        if (hasProperty(data, "damage") && hasProperty(data, "ed") && hasProperty(data, "ap"))
        {
            data.damage = mergeObject(data.damage, {ed : data.ed, ap : data.ap, otherDamage : data.otherDamage});
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
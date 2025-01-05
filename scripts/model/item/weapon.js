import { DamageModel } from "./components/damage";
import { EquippedItemModel } from "./components/equipped";
import { TraitsModel } from "./components/traits";

let fields = foundry.data.fields;

export class WeaponModel extends EquippedItemModel
{

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.attack = new fields.SchemaField({
            base : new fields.NumberField({}),
            bonus : new fields.NumberField({}),
            rank : new fields.StringField({initial : "none"}),
        })

        schema.ed = new fields.ObjectField({deprecated : true})
        schema.ap = new fields.ObjectField({deprecated : true})
        schema.otherDamage = new fields.ObjectField({deprecated : true})

        schema.damage = new fields.EmbeddedDataField(DamageModel);
        schema.category = new fields.StringField({initial : "melee"});
        schema.range = new fields.SchemaField({
            short : new fields.NumberField({}),
            medium : new fields.NumberField({}),
            long : new fields.NumberField({}),
            melee : new fields.NumberField({initial : 1}),
            thrown : new fields.NumberField({nullable : true}),
        })
        schema.category = new fields.StringField({initial : "melee"});
        schema.ammo = new fields.EmbeddedDataField(DocumentReferenceModel);
        schema.salvo = new fields.NumberField({})
        schema.traits = new fields.EmbeddedDataField(TraitsModel);
        schema.upgrades = new fields.ArrayField(new fields.ObjectField());
        schema.combi = new fields.EmbeddedDataField(DocumentReferenceModel);
        schema.twinned = new fields.BooleanField();
        return schema;
    }

    get isMelee() {
        return this.category == "melee"
    }

    get isRanged() {
        return this.category == "ranged" || this.category == "launcher" || this.category == "grenade-missile"
    }

    get Range() {
        if (this.isRanged) {
            if (this.category == "grenade-missile") 
            {
                if (this.parent.actor && this.parent.actor.type != "vehicle")
                    return this.range.thrown * this.parent.actor.attributes.strength.total
                else if (this.range.thrown)
                    return `S x ${this.range.thrown}`
            }
            else {
                const short = this.range.short < 1 ? "-" : this.range.short;
                const medium = this.range.medium < 1 ? "-" : this.range.medium;
                const long = this.range.long < 1 ? "-" : this.range.long;
                const salvo = this.salvo < 1 ? "-" : this.salvo;
                return `${salvo} | ${short} / ${medium} / ${long}`;
            }
        }
        else if (this.isMelee) {
            return this.range.melee
        }
    }

    get Category() {
        switch (this.category) {
            case "melee":
                return game.i18n.localize("CATEGORY.MELEE");
            case "ranged":
                return game.i18n.localize("CATEGORY.RANGED");
            default:
                return game.i18n.localize("CATEGORY.MELEE");
        }
    }

    get upgradeItems() {
        return this.upgrades.map(i => new CONFIG.Item.documentClass(i))
    }

    get MultiTarget() {
        return this.multiTarget ? game.i18n.localize("Yes") : game.i18n.localize("No")
    }

    computeBase()
    {
        this.damage.enabled = true;
    }

    computeDerived()
    {
        this.applyUpgrades();
    }

    computeOwned()
    {
        if (this.isRanged && this.category == "launcher" && this.Ammo) {
            this.damage = this.Ammo.system.damage
        }
        if (this.isRanged && this.Ammo) {
            this.applyAmmo()
        }

        if (this.combi.id)
        {
            let combi = this.parent.actor?.items.get(this.combi.id);
            if (combi)
            {
                this.combi.document = combi;
            }
        }
    }

    applyUpgrades() {

        if (this.upgradesApplied)
            return
        else 
            this.upgradesApplied = true;

        this._applyEffects(this.upgradeItems.reduce((effects, upgrade) => {
            return effects.concat(Array.from(upgrade.effects))
        }, []))

        this.traits.add(this.upgradeItems.reduce((traits, upgrade) => {
            return traits.concat(upgrade.traits.list)
        }, []))
    }

    applyAmmo() {
        this._applyEffects(this.Ammo.effects)
        this.traits.add(this.Ammo.system.traits)
    }

    getOtherEffects()
    {
        let other = super.getOtherEffects().concat(this.traits.effects);
        if (this.Ammo)
        {
            other = other.concat(this.Ammo.effects.contents);
        }
        for(let upg of this.upgrades)
        {
           other = other.concat(upg.effects.map(e => new ActiveEffect.implementation(e, {parent : this.parent})));
        }
        return other;
    }

    _addModelProperties()
    {
        if (this.parent.actor)
        {
            this.ammo.relative = this.parent.actor.items
            this.combi.relative = this.parent.actor.items
        }
    }

    _applyEffects(effects) {
        let overrides = {}
        // Organize non-disabled effects by their application priority
        const changes = effects.reduce((changes, e) => {
            if (e.disabled) return changes;
            return changes.concat(e.changes.map(c => {
                c = foundry.utils.duplicate(c);
                c.effect = e;
                c.priority = c.priority ?? (c.mode * 10);
                return c;
            }));
        }, []);
        changes.sort((a, b) => a.priority - b.priority);

        // Apply all changes
        for (let change of changes) 
        {
            let key = change.key.replace("system.ed", "system.damage.ed").replace("system.ap", "system.damage.ap");

            if (hasProperty(this.parent, key)) 
            {

                if (change.mode == CONST.ACTIVE_EFFECT_MODES.ADD) 
                {
                    setProperty(this.parent, key, getProperty(this.parent, key) + Number(change.value))
                }
                else if (change.mode == CONST.ACTIVE_EFFECT_MODES.OVERRIDE) 
                {
                    setProperty(this.parent, key, change.value)
                }
                else if (change.mode == CONST.ACTIVE_EFFECT_MODES.UPGRADE) 
                {
                    if (change.value > getProperty(this.parent, key))
                    {
                        setProperty(this.parent, key, change.value)
                    }
                }
            }
        }

    }


    get Ammo() {
        return this.ammo.document
    }


    static migrateData(data)
    {
        super.migrateData(data);
        if (typeof data.ammo == "string")
        {
            data.ammo = {id : data.ammo};
        }
    }

}
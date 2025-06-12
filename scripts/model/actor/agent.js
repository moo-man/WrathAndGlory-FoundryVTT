import { StandardWNGActorModel } from "./components/standard";
import { AgentCombatModel } from "./components/combat";
import { AgentSkillsModel } from "./components/skills";
import { AgentAttributesModel } from "./components/attributes";
const fields = foundry.data.fields;

export class AgentModel extends StandardWNGActorModel {

    static defineSchema() {
        let schema = super.defineSchema();
        schema.attributes = new fields.EmbeddedDataField(AgentAttributesModel)
        schema.skills = new fields.EmbeddedDataField(AgentSkillsModel);
        schema.combat = new fields.EmbeddedDataField(AgentCombatModel)
        schema.experience = new fields.SchemaField({
            current: new fields.NumberField(),
            spent: new fields.NumberField(),
            total: new fields.NumberField()
        })

        schema.advances = new fields.SchemaField({
            tier: new fields.NumberField(),
            rank: new fields.NumberField()
          });

        schema.bio = new fields.SchemaField({
            species : new fields.StringField(),
            faction : new fields.StringField(),
            archetype : new fields.StringField(),
            quote : new fields.StringField(),
            height  : new fields.StringField(),
            eye  : new fields.StringField(),
            hair  : new fields.StringField(),
            origin : new fields.StringField(),
            accomplishment : new fields.StringField(),
            goal : new fields.StringField(),
            objective  : new fields.StringField()
        })

        schema.resources = new fields.SchemaField({
            wrath : new fields.NumberField({min : 0}),
            faith: new fields.SchemaField({
              current: new fields.NumberField({min : 0}),
              total: new fields.NumberField({min : 0}),
            }),
            wealth : new fields.NumberField({min : 0}),
            influence : new fields.NumberField({min : 0}),
        })

        
        schema.corruption = new fields.SchemaField({
            current : new fields.NumberField({min : 0}),
        })

        schema.notes = new fields.HTMLField();

        return schema;
    }

    async _preCreate(data, options, user) 
    {
        await super._preCreate(data, options, user);
        this.parent.updateSource({
                "prototypeToken.sight.enabled" : true,
                "prototypeToken.actorLink" : true
        })
    }

    computeBase() {
        super.computeBase();
    }

    computeDerived()
    {
        let itemTypes = this.parent.itemTypes;
        super.computeDerived();
        this.attributes.computeCosts(this.experience)
        this.skills.computeCosts(this.experience)
        for(let item of itemTypes.talent.concat(itemTypes.psychicPower, itemTypes.archetype, itemTypes.ability, itemTypes.ascension)) // Don't include species, already included in archetye
        {
            this.experience.spent += item.cost;
        }

        this.experience.current = this.experience.total - this.experience.spent;
    }

    static migrateData(data)
    {
        super.migrateData(data);
        if (typeof data.bio.origin == "object")
        {
            data.bio.origin = data.bio.origin.value;
        }
        if (typeof data.bio.accomplishment == "object")
        {
            data.bio.accomplishment = data.bio.accomplishment.value;
        }
        if (typeof data.bio.goal == "object")
        {
            data.bio.goal = data.bio.goal.value;
        }
    }
}

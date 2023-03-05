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

        schema.bio = new fields.SchemaField({
            species : new fields.StringField(),
            faction : new fields.StringField(),
            archetype : new fields.StringField(),
            quote : new fields.StringField(),
            height  : new fields.StringField(),
            eye  : new fields.StringField(),
            hair  : new fields.StringField(),
            origin : new fields.SchemaField({
                value  : new fields.StringField(),
                bonus  : new fields.StringField()
            }),
            accomplishment : new fields.SchemaField({
                value  : new fields.StringField(),
                bonus  : new fields.StringField()
            }),
            goal : new fields.SchemaField({
                value  : new fields.StringField(),
                bonus  : new fields.StringField()
            }),
            objective  : new fields.StringField()
        })

        schema.notes = new fields.StringField();

        return schema;
    }

    computeBase() {
        super.computeBase();
        this.attributes.computeCosts(this.experience)
        this.skills.computeCosts(this.experience)
        
    }

    computeDerived(items, autoCalc)
    {
        super.computeDerived(items, autoCalc);
        for(let item of items.talent.concat(items.psychicPower, items.archetype, items.ability)) // Don't include species, already included in archetye
        {
            this.experience.spent += item.cost;
        }

        this.experience.current = this.experience.total - this.experience.spent;


        //SINGETON TYPES
        this.system.bio.origin.value = this.system.bio.origin.value || this.faction?.backgrounds.origin.find(b => b.active)?.description
        this.system.bio.accomplishment.value = this.system.bio.accomplishment.value || this.faction?.backgrounds.accomplishment.find(b => b.active)?.description
        this.system.bio.goal.value = this.system.bio.goal.value || this.faction?.backgrounds.goal.find(b => b.active)?.description

    }
}

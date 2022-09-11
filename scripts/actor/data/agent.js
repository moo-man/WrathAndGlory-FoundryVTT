import { AgentAttributesModel } from "./attributes";
import { BaseWNGActor } from "./base";
import { CombatModel } from "./combat";
import { AgentSkillsModel } from "./skills";

export class AgentData extends BaseWNGActor {
    static defineSchema() {
        let schema = super.defineSchema();
        return mergeObject(schema, {
            attributes: new foundry.data.fields.EmbeddedDataField(AgentAttributesModel),
            skills : new foundry.data.fields.EmbeddedDataField(AgentSkillsModel),
            experience : new foundry.data.fields.SchemaField({
                current : new foundry.data.fields.NumberField(),
                spent : new foundry.data.fields.NumberField(),
                total : new foundry.data.fields.NumberField()
            }, {overwrite : true})
        })
    }

    compute() {
        super.compute();
        
    }
}

import { DefaultAttributesModel } from "./attributes";
import { CombatModel } from "./combat";
import { SkillsModel } from "./skills";

export class BaseWNGActor extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            attributes: new foundry.data.fields.EmbeddedDataField(DefaultAttributesModel),
            skills : new foundry.data.fields.EmbeddedDataField(SkillsModel),
            combat : new foundry.data.fields.EmbeddedDataField(CombatModel),
        }
    }

    compute() {
        this.attributes.compute();
        this.skills.compute();
        this.combat.compute(this.attributes);
    }
}

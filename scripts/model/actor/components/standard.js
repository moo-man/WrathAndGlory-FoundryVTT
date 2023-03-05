import { AttributesModel } from "./attributes";
import { BaseWnGActorModel } from "./base";
import { CombatModel } from "./combat";
import { SkillsModel } from "./skills";

export class StandardWNGActorModel extends BaseWnGActorModel {
    static defineSchema() {
        return {
            attributes: new foundry.data.fields.EmbeddedDataField(AttributesModel),
            skills : new foundry.data.fields.EmbeddedDataField(SkillsModel),
            combat : new foundry.data.fields.EmbeddedDataField(CombatModel),
        }
    }

    computeBase() 
    {
        this.attributes.compute();
        this.skills.compute(this.attributes);
    }

    computeDerived(items, autoCalc) {
        this.combat.compute(this.attributes, this.skills, items, autoCalc);
    }
}

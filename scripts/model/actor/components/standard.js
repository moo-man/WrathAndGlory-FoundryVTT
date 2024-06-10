import { AttributesModel } from "./attributes";
import { BaseWnGActorModel } from "./base";
import { CombatModel } from "./combat";
import { SkillsModel } from "./skills";

export class StandardWNGActorModel extends BaseWnGActorModel {

        
    async _preCreate(data, options, user) 
    {
        await super._preCreate(data, options, user);
        this.parent.updateSource({
            "prototypeToken.bar1": { "attribute": "combat.wounds" },
            "prototypeToken.bar2": { "attribute": "combat.shock" },
            "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            "prototypeToken.disposition": CONST.TOKEN_DISPOSITIONS.NEUTRAL,
            "prototypeToken.name": data.name,
            "flags.wrath-and-glory.autoCalc.defence": true,
            "flags.wrath-and-glory.autoCalc.resilience": true,
            "flags.wrath-and-glory.autoCalc.shock": true,
            "flags.wrath-and-glory.autoCalc.awareness": true,
            "flags.wrath-and-glory.autoCalc.resolve": true,
            "flags.wrath-and-glory.autoCalc.determination": true,
            "flags.wrath-and-glory.autoCalc.wounds": true,
            "flags.wrath-and-glory.autoCalc.conviction": true,
            "flags.wrath-and-glory.autoWounded": true,
            "flags.wrath-and-glory.autoExhausted": true,
            "flags.wrath-and-glory.generateMetaCurrencies": true
        })
    }
    

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

    computeDerived() {
        this.combat.compute();
    }
}

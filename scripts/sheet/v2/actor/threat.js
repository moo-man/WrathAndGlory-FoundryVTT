import { StandardActorSheet } from "./standard";

export class ThreatSheet extends StandardActorSheet {
    static DEFAULT_OPTIONS = {
        actions : {
            configureMob : this._onConfigureMob
        },
      }   

      async _prepareContext(options)
      {
        let context = await super._prepareContext(options);
        context.mobAbilities = this.document.system.mob.abilities.documents.filter(i => !i.system.isActiveMobAbility);
        return context;
      }



      _attributeAndSkillTooltips(context) {

        for (let attribute of Object.values(context.system.attributes)) {
            attribute.tooltip = `Rating: ${attribute.rating} | Advance Cost: ${game.wng.utility.getAttributeCostIncrement(attribute.rating + 1)} | Current XP: ${this.actor.experience.current}`
        }

        for (let skill of Object.values(context.system.skills)) {
            skill.tooltip = `Rating: ${skill.rating} | Advance Cost: ${game.wng.utility.getSkillCostIncrement(skill.rating + 1)} | Current XP: ${this.actor.experience.current}`
        }
    }

    static _onConfigureMob() 
    {
        new MobConfig(this.document).render(true);
    }


}

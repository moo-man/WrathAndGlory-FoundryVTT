import { StandardActorSheet } from "./standard";

export class AgentSheet extends StandardActorSheet {
    static DEFAULT_OPTIONS = {
        actions : {

        },
        defaultTab: "stats"
      }   

      static PARTS = {
        header : {scrollable: [""], template : 'systems/wrath-and-glory/templates/actor/agent/agent-header.hbs', classes: ["sheet-header"] },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        stats: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-stats.hbs' },
        combat: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-combat.hbs' },
        abilities: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-abilities.hbs' },
        gear: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-gear.hbs' },
        effects: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-effects.hbs' },
        notes: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/agent/agent-notes.hbs' },
      }

      
      static TABS = {
        stats: {
          id: "main",
          group: "primary",
          label: "TAB.STATS",
        },
        combat: {
          id: "combat",
          group: "primary",
          label: "TAB.COMBAT",
        },
        abilities: {
          id: "abilities",
          group: "primary",
          label: "TAB.ABILITIES",
        },
        effects: {
          id: "effects",
          group: "primary",
          label: "TAB.EFFECTS",
        },
        gear: {
          id: "gear",
          group: "primary",
          label: "TAB.GEAR",
        },
        notes: {
          id: "notes",
          group: "primary",
          label: "TAB.NOTES",
        }
      }

      async _prepareContext(options)
      {
          let context = await super._prepareContext(options);
            this._attributeAndSkillTooltips(context)
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


}

import { MobConfig } from "../../../apps/mob-config";
import { StandardActorSheet } from "./standard";

export class ThreatSheet extends StandardActorSheet {
    static DEFAULT_OPTIONS = {
        actions : {
            configureMob : this._onConfigureMob
        },
        defaultTab : "stats"
    }   

      static PARTS = {
        header : {scrollable: [""], template : 'systems/wrath-and-glory/templates/actor/threat/threat-header.hbs', classes: ["sheet-header"] },
        tabs: { scrollable: [""], template: 'templates/generic/tab-navigation.hbs' },
        stats: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-stats.hbs' },
        combat: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-combat.hbs' },
        abilities: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-abilities.hbs' },
        gear: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-gear.hbs' },
        effects: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/actor-effects.hbs' },
        notes: { scrollable: [""], template: 'systems/wrath-and-glory/templates/actor/threat/threat-notes.hbs' },
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
        context.mobAbilities = this.document.system.mob.abilities.documents.filter(i => !i.system.isActiveMobAbility);
        return context;
      }

    static _onConfigureMob() 
    {
        new MobConfig(this.document).render(true);
    }


}

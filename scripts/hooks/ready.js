import {migrateWorld} from "../common/migration.js"
import FoundryOverrides from "../common/overrides.js"

export default function() {
    Hooks.once("ready", () => {
        migrateWorld();
        game.counter.render(true)

        for (let key in game.wng.config) {
            for (let prop in game.wng.config[key]) {
                if (typeof game.wng.config[key][prop] == "string")
                    game.wng.config[key][prop] = game.i18n.localize(game.wng.config[key][prop])
            }
        }

        for (let effect of CONFIG.statusEffects) {
            effect.label = game.i18n.localize(effect.label)
        }
    });

    CONFIG.ChatMessage.documentClass.prototype.getTest = function () {
        if (hasProperty(this, "data.flags.wrath-and-glory.testData"))
          return game.wng.rollClasses.WNGTest.recreate(this.getFlag("wrath-and-glory", "testData"))
      }


    FoundryOverrides();



}

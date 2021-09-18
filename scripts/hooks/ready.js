import {migrateWorld} from "../common/migration.js"
import FoundryOverrides from "../common/overrides.js"

export default function() {
    Hooks.once("ready", () => {
        migrateWorld();
        game.counter.render(true)
    });

    CONFIG.ChatMessage.documentClass.prototype.getTest = function () {
        if (hasProperty(this, "data.flags.wrath-and-glory.testData"))
          return game.wng.rollClasses.WNGTest.recreate(this.getFlag("wrath-and-glory", "testData"))
      }

    FoundryOverrides();

}
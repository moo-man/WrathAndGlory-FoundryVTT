import {migrateWorld} from "../common/migration.js"
import FoundryOverrides from "../common/overrides.js"

export default function() {
    Hooks.once("ready", () => {
        migrateWorld();
        game.counter.render(true)
        game.wng.tags.createTags();

        if (game.release.generation == 12)
        {
            ui.notifications.warn("Please note that the <strong>Wrath & Glory</strong> system has not been made fully compatible with V12 and issues may occur.")
        }
    });
    
    CONFIG.ChatMessage.documentClass.prototype.getTest = function () {
        if (hasProperty(this, "flags.wrath-and-glory.testData"))
          return game.wng.rollClasses.WNGTest.recreate(this.getFlag("wrath-and-glory", "testData"))
      }

    FoundryOverrides();



}

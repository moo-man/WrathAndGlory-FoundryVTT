import {migrateWorld} from "../common/migration.js"
import FoundryOverrides from "../common/overrides.js"

export default function() {
    Hooks.once("ready", () => {
        migrateWorld();
        game.counter.render(true)
    });

    CONFIG.ChatMessage.documentClass.prototype.getTest = function () {
        if (hasProperty(this, "data.flags.data.testData"))
          return game.wfrp4e.rolls.TestWFRP.recreate(this.data.flags.data.testData)
      }

    FoundryOverrides();

}
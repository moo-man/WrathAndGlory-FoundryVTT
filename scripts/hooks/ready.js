import {migrateWorld} from "../common/migration.js"

export default function() {
    Hooks.once("ready", () => {
        migrateWorld();
        game.counter.render(true)
    });
}
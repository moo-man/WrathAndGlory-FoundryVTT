import FoundryOverrides from "../common/overrides.js"

export default function() {
    Hooks.once("ready", () => {
        game.counter.render(true)

        FoundryOverrides();

    });
}

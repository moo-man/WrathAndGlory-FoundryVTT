import WnGThemeConfig from "../apps/theme.js";
import FoundryOverrides from "../common/overrides.js"

export default function() {
    Hooks.once("ready", () => {
        WnGThemeConfig.setTheme();
        game.counter.render({force: true})

        FoundryOverrides();

    });
}

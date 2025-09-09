import WnGThemeConfig from "../apps/theme.js";
import FoundryOverrides from "../common/overrides.js"

export default function() {
    Hooks.once("ready", () => {
        SocketHandler.register();
        WnGThemeConfig.setTheme();
        game.counter.render({force: true})

        FoundryOverrides();

    });
}

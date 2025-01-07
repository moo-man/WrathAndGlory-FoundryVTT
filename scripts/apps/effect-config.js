export default class WrathAndGloryActiveEffectConfig extends WarhammerActiveEffectConfig {


    effectKeysTemplate = "systems/wrath-and-glory/template/apps/effect-key-options.hbs";

    static get defaultOptions() 
    {
        const options = super.defaultOptions;
        options.classes = options.classes.concat(["wrath-and-glory"]);
        return options;
    }
}
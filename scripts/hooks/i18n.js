
export default function() 
{
    Hooks.on("i18nInit", () => {
        for (let key in game.wng.config) {
            for (let prop in game.wng.config[key]) {
                if (typeof game.wng.config[key][prop] == "string")
                game.wng.config[key][prop] = game.i18n.localize(game.wng.config[key][prop])
            }
        }
        
        for (let effect of CONFIG.statusEffects) {
            effect.name = game.i18n.localize(effect.name)
        }
        
        for (let e in game.wng.config.systemEffects) {
            let effect = game.wng.config.systemEffects[e]
            effect.name = game.i18n.localize(effect.name)
        }
    })
}
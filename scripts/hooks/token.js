export default function() {
    Hooks.on("createToken", (token) => token.object.drawMobNumber())
    Hooks.on("updateToken", (token) => token.object.drawMobNumber())
}
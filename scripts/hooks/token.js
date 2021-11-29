export default function() {
    Hooks.on("updateToken", (token) => {
        token.object.drawMobNumber()
    })
}
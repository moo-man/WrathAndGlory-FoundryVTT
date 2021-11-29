export default function() {
    Hooks.on("canvasReady", (canvas) => {
        canvas.tokens.placeables.forEach(t => {
            t.drawMobNumber()
        })
    })
}
export default function () {
  Hooks.on("init", () => {

    game.counter = new game.wag.RuinGloryCounter()

    game.socket.on("system.wrath-and-glory", async data => {
      if (data.type == "updateCounter") {
        game.counter.render(true)
      }
      else if (data.type == "setCounter" && game.user.isGM) {
        await game.settings.set("wrath-and-glory", data.payload.type, data.payload.value)
        game.counter.render(true)
      }
    })
  })


}
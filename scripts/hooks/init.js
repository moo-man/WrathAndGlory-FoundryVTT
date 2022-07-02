export default function () {
  Hooks.on("init", () => {

    game.counter = new game.wng.RuinGloryCounter()

    game.socket.on("system.wrath-and-glory", async data => {
      if (data.type == "setCounter" && game.user.isGM) {
        game.settings.set("wrath-and-glory", data.payload.type, data.payload.value)
      }
    })
  })


}
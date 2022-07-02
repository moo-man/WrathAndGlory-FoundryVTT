export default function () {
  Hooks.on("updateSetting", (setting) => {
    if(setting.key == "wrath-and-glory.glory" || setting.key == "wrath-and-glory.ruin")
    {
      game.counter.render(true)
    }
  })
}
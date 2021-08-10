export default function() {
  Hooks.on("init", () => {
    game.settings.register("wrath-and-glory", "worldSchemaVersion", {
      name: "World Version",
      hint: "Used to automatically upgrade worlds data when the system is upgraded.",
      scope: "world",
      config: true,
      default: 0,
      type: Number,
    });
  })

}
export default function() {
  Hooks.on("init", () => {
    game.settings.register("wrath-and-glory", "worldSchemaVersion", {
      name: "World Version",
      hint: "Used to automatically upgrade worlds data when the system is upgraded.",
      scope: "world",
      config: false,
      default: 0,
      type: Number,
    });

    game.settings.register('wrath-and-glory', 'playerCounterEdit', {
      name: 'Allow Players To Edit Glory',
      hint: 'Players will be able to change Glory counter values manually.',
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
  
    game.settings.register('wrath-and-glory', 'glory', {
      name: 'Glory',
      scope: 'world',
      config: false,
      default: 0,
      type: Number,
    });
  
    
    game.settings.register('wrath-and-glory', 'ruin', {
      name: 'Ruin',
      scope: 'world',
      config: false,
      default: 0,
      type: Number,
    });
  })

}
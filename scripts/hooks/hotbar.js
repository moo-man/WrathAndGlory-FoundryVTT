
export default function() {
    /**
     * Create a macro when dropping an entity on the hotbar
     * Item      - open roll dialog for item
     * Actor     - open actor sheet
     * Journal   - open journal sheet
     */
    Hooks.on("hotbarDrop", (bar, data, slot) => {

      if (data.type == "Item" || data.type == "Actor")
      {
        createMacro(bar, data, slot)
        return false
      }

    });
    

    async function createMacro(bar, data, slot)
    {
      let document = await fromUuid(data.uuid);
      let command
      // Create item macro if rollable item - weapon, spell, prayer, trait, or skill
      if (document.documentName == "Item") {
        if (document.type != "weapon" && document.type != "psychicPower" && document.type != "ability")
          command = `Hotbar.toggleDocumentSheet("${data.uuid}")`
        else 
          command = `game.wng.utility.rollItemMacro("${document.name}", "${document.type}");`;

        let macro = game.macros.contents.find(m => (m.name === document.name) && (m.command === command));
        if (!macro) {
          macro = await Macro.create({
            name: document.name,
            type: "script",
            img: document.img,
            command: command
          }, { displaySheet: false })
        }
        game.user.assignHotbarMacro(macro, slot);
      }
      // Create a macro to open the actor sheet of the actor dropped on the hotbar
      else if (document.documentName == "Actor") {
        command = `game.actors.get("${document.id}").sheet.render(true)`
        let macro = game.macros.contents.find(m => (m.name === document.name) && (m.command === command));
        if (!macro) {
          macro = await Macro.create({
            name: document.name,
            type: "script",
            img: document.img,
            command: command
          }, { displaySheet: false })
          game.user.assignHotbarMacro(macro, slot);
        }
      }
    }
    
  }
  
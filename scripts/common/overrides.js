export default function() {

  
  JournalEntryPage.prototype.showInJournal = function() {
    let journal = this.parent;
    journal.sheet.goToPage(this.id)
  }



   /**
    * Apply data transformations when importing a Document from a Compendium pack
    * @param {Document|object} document    The source Document, or a plain data object
    * @return {Object}                     The processed data ready for world Document creation
    * @override - Retain ID
    */
   function fromCompendiumRetainID(document) {
    let data = document;
    if ( document instanceof foundry.abstract.Document ) {
      data = document.toObject();
      if ( !data.flags.core?.sourceId ) foundry.utils.setProperty(data, "flags.core.sourceId", document.uuid);
    }

    // Eliminate some fields that should never be preserved
    const deleteKeys = [];
    for ( let k of deleteKeys ) {
      delete data[k];
    }

    // Reset some fields to default values
    if ( "sort" in data ) data.sort = 0;
    if ( "permissions" in data ) data.permissions = {[game.user.id]: CONST.ENTITY_PERMISSIONS.OWNER};
    return data;
  }


  // Replace collection functions with new function to retain IDs
  Actors.prototype.fromCompendium = fromCompendiumRetainID;
  Items.prototype.fromCompendium = fromCompendiumRetainID;
  Journal.prototype.fromCompendium = fromCompendiumRetainID;
  Scenes.prototype.fromCompendium = fromCompendiumRetainID;
  RollTables.prototype.fromCompendium = fromCompendiumRetainID;

  // Replace collection functions for journal and scene document classes because WFRP does not extend these
  // keep old functions
  let sceneToCompendium = CONFIG.Scene.documentClass.prototype.toCompendium
  let journalToCompendium = CONFIG.JournalEntry.documentClass.prototype.toCompendium
  let tableToCompendium = CONFIG.RollTable.documentClass.prototype.toCompendium

  // Call old functions, but tack on ID again after they finish
  CONFIG.JournalEntry.documentClass.prototype.toCompendium = function(pack)
  {
    let data = journalToCompendium.bind(this)(pack)
    data._id = this.id
    return data
  }
  
  CONFIG.Scene.documentClass.prototype.toCompendium = function(pack)
  {
    let data = sceneToCompendium.bind(this)(pack)
    data._id = this.id
    return data
  }

    
  CONFIG.RollTable.documentClass.prototype.toCompendium = function(pack)
  {
    let data = tableToCompendium.bind(this)(pack)
    data._id = this.id
    return data
  }

    // Since IDs are maintained in WNG, we have to clean actor imports from their IDs
    function WNGImportFromJson(json) {
        const data = JSON.parse(json);
        delete data._id
        if (data.token)
          delete data.token.actorId
        this.updateSource(data, {recursive: false});
        return this.update(this.toJSON(), {diff: false, recursive: false});
      }
    
       // keep old functions
       CONFIG.Scene.documentClass.prototype.importFromJSON = WNGImportFromJson;
       CONFIG.JournalEntry.documentClass.prototype.importFromJSON = WNGImportFromJson;
       CONFIG.Actor.documentClass.prototype.importFromJSON = WNGImportFromJson;
       CONFIG.Item.documentClass.prototype.importFromJSON = WNGImportFromJson;



  /**
   * @override Draw token bars in reverse
   */
  Token.prototype._drawBar = function(number, bar, data) {
    const val = Number(data.value);
    const pct = 1 - Math.clamped(val, 0, data.max) / data.max;

    // Determine sizing
    let h = Math.max((canvas.dimensions.size / 12), 8);
    const w = this.w;
    const bs = Math.clamped(h / 8, 1, 2);
    if ( this.height >= 2 ) h *= 1.6;  // Enlarge the bar for large tokens

    // Determine the color to use
    const blk = 0x000000;
    let color;
    if ( number === 0 ) color = PIXI.utils.rgb2hex([(1-(pct/2)), pct, 0]);
    else color = PIXI.utils.rgb2hex([(0.5 * pct), (0.7 * pct), 0.5 + (pct / 2)]);

    // Draw the bar
    bar.clear()
    bar.beginFill(blk, 0.5).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, this.w, h, 3)
    bar.beginFill(color, 1.0).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, pct*w, h, 2)

    // Set position
    let posY = number === 0 ? this.h - h : 0;
    bar.position.set(0, posY);
  }


  Token.prototype.drawMobNumber = function() {
    let actor = this.document?.actor
    if (actor && actor.type == "threat" && actor.isMob)
    {
      if (this.mobNumber) 
        this.mobNumber.destroy()
      this.mobNumber =  new PIXI.Container()
      let style = this._getTextStyle()
      style._fontSize = (this.h/this.w * this.h) * 0.25 
      this.mobNumber.addChild(new PreciseText(actor.mob, style))
      //this.mobNumber.zIndex = 10
      this.mobNumber.position.set(this.w-(this.w * 0.3), this.h-(this.h * 0.3))
      this.addChild(this.mobNumber)
    }
    else if (this.mobNumber)
    {
      this.mobNumber.destroy() 
    }
  }
}

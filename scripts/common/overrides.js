export default function() {


  // Convert functions that move data between world and compendium to retain ID
  Actors.prototype.fromCompendium = keepID(Actors.prototype.fromCompendium);
  Items.prototype.fromCompendium = keepID(Items.prototype.fromCompendium);
  Journal.prototype.fromCompendium = keepID(Journal.prototype.fromCompendium);
  Scenes.prototype.fromCompendium = keepID(Scenes.prototype.fromCompendium);
  RollTables.prototype.fromCompendium = keepID(RollTables.prototype.fromCompendium);

  Actor.implementation.prototype.toCompendium = keepID(Actor.implementation.prototype.toCompendium);
  Item.implementation.prototype.toCompendium = keepID(Item.implementation.prototype.toCompendium);
  JournalEntry.implementation.prototype.toCompendium = keepID(JournalEntry.implementation.prototype.toCompendium);
  Scene.implementation.prototype.toCompendium = keepID(Scene.implementation.prototype.toCompendium);
  RollTable.implementation.prototype.toCompendium = keepID(RollTable.implementation.prototype.toCompendium);



  function keepID(orig)
  {
    return function(...args)
    {
      try {
        args[1].keepId = true;
      }
      catch(e)
      {
        console.error("Error setting keepId: " + e);
      }
      return orig.bind(this)(...args);
    }
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
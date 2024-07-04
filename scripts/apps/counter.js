export default class RuinGloryCounter extends Application {
    static get defaultOptions() {
      const options = super.defaultOptions;
      options.title = "Glory & Ruin Counter";
      options.id = 'counter';
      options.template = 'systems/wrath-and-glory/template/apps/counter.hbs';
      return options;
    }
    /* -------------------------------------------- */
    /**
     * Provide data to the HTML template for rendering
     * @type {Object}
     */
    getData() {
      const data = super.getData();
      data.glory = game.settings.get('wrath-and-glory', 'glory');
      data.ruin = game.settings.get('wrath-and-glory', 'ruin');
      data.canEdit =
        game.user.isGM || game.settings.get('wrath-and-glory', 'playerCounterEdit');
  
      return data;
    }

    render(force=false, options={})
    {
      let userPosition = game.settings.get("wrath-and-glory", "counterPosition")
      if (userPosition.hide)
        return
      options.top = userPosition.top || window.innerHeight - 200
      options.left = userPosition.left || 250
      super.render(force, options)
    }

    async _render(...args)
    {
      await super._render(...args)
      delete ui.windows[this.appId]
    }

    setPosition(...args) {
      super.setPosition(...args);
      game.settings.set("wrath-and-glory", "counterPosition", this.position)
    }

    // close(){
    //   return
    // }
  
    activateListeners(html) {
      super.activateListeners(html);

      new Draggable(this, html, html.find(".handle")[0], false)
  
      html.find('input').focusin(ev => {
        ev.target.select()
      })
      // Call setCounter when input is used
      this.input = html.find('input').change(async ev => {
        const type = $(ev.currentTarget).attr('data-type');
        RuinGloryCounter.setCounter(ev.target.value, type);
      });
  
      // Call changeCounter when +/- is used
      html.find('.incr,.decr').mousedown(async ev => {
        let input = $(ev.target.parentElement).find("input")
        const type = input.attr('data-type');
        const multiplier = $(ev.currentTarget).hasClass('incr') ? 1 : -1;
        $(ev.currentTarget).toggleClass("clicked")
        let newValue = await RuinGloryCounter.changeCounter(1 * multiplier, type);
        input[0].value = newValue
      });
  
      html.find('.incr,.decr').mouseup(ev => {
        $(ev.currentTarget).removeClass("clicked")
      });
    }
  
    // ************************* STATIC FUNCTIONS ***************************
  
    /**
     * Set the counter of (type) to (value)
     * @param value Value to set counter to
     * @param type  Type of counter, "momentum" or "doom"
     */
    static async setCounter(value, type) {
      value = Math.round(value);
  
      if (!game.user.isGM) {
        game.socket.emit('system.wrath-and-glory', {
          type: 'setCounter',
          payload: {value, type},
        });
      }
      else
      {
        game.settings.set('wrath-and-glory', type, value);
      }
  
      return value
    }
  
    /**
     * Change the counter of (type) by (value)
     * @param diff How much to change the counter
     * @param type  Type of counter, "momentum" or "doom"
     */
    static async changeCounter(diff, type) {
      let value = game.settings.get('wrath-and-glory', type);
      return await RuinGloryCounter.setCounter(value + diff, type)
    }


    static getValue(type)
    {
        return game.settings.get('wrath-and-glory', type);
    }

    get glory()
    {
      return RuinGloryCounter.getValue("glory")
    }

    get ruin()
    {
      return RuinGloryCounter.getValue("ruin")
    }
  
  }


  Hooks.on("renderSceneControls", (app, html, options) => {
    let button = $(`<li class='scene-controls' data-tooltip="${game.i18n.localize("CONTROLS.WNGCounterToggle")}"><i class="fa-solid fa-input-numeric"></i></li>`)
    button.on("click", () => {

      // Retain show/hide on refresh by storing in settings
      position = game.settings.get("wrath-and-glory", "counterPosition")
      position.hide = game.counter.rendered;
      game.settings.set("wrath-and-glory", "counterPosition", position);
      
      game.counter.rendered ? game.counter.close() : game.counter.render(true);
    })
    html.find("ol.main-controls").append(button)
  })
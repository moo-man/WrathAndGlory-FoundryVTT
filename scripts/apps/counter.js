export default class RuinGloryCounter extends HandlebarsApplicationMixin(ApplicationV2) {
  

    static DEFAULT_OPTIONS = {
      id: "counter",
      classes : ["warhammer", "wrath-and-glory"],
      position: {
        width: 240,
        height: 85
      },
      actions: {
        stepValue : this._onStepValue
      }
    };

    static PARTS = {
      counter: {
          template: "systems/wrath-and-glory/templates/apps/counter.hbs"
        },
    };


    /* -------------------------------------------- */
    /**
     * Provide data to the HTML template for rendering
     * @type {Object}
     */
    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      context.glory = game.settings.get('wrath-and-glory', 'glory');
      context.ruin = game.settings.get('wrath-and-glory', 'ruin');
      context.canEdit = game.user.isGM || game.settings.get('wrath-and-glory', 'playerCounterEdit');
  
      return context;
    }

    get hasFrame() {
      return false;
    }

    render(options={})
    {
      let userPosition = game.settings.get("wrath-and-glory", "counterPosition")
      options.position = userPosition

      if (options.position.hide)
      {
        return
      }
      else 
      {
        delete options.position.hide;
        super.render(options);
      }

    }


    setPosition(...args) {
      super.setPosition(...args);
      game.settings.set("wrath-and-glory", "counterPosition", this.position)
    }


    close(options)
    {
      if (options.fromControls)
      {
        super.close(options);
      }
    }

    async _onRender(options)
    {
      await super._onRender(options);
      new foundry.applications.ux.Draggable.implementation(this, this.element, this.element.querySelector(".handle"), false)


      let inputs = this.element.querySelectorAll("input")
      inputs.forEach(input => {
        input.addEventListener("change", ev => {
          let counter = ev.target.dataset.counter;
          RuinGloryCounter.setCounter(ev.target.value, counter);
        });

        input.addEventListener("mousedown", ev => {
          ev.target.classList.add("clicked");
        })

        input.addEventListener("mouseup", ev => {
          ev.target.classList.remove("clicked");
        })

        input.addEventListener("focusin", ev => {
          ev.target.select();
        })
      })
    }

    static async  _onStepValue(ev, target)
    {
      let input = target.parentElement.querySelector("input");
      let counter = input.dataset.counter;
      let multiplier = target.dataset.type == "incr" ? 1 : -1;
      target.classList.toggle("clicked");
      let newValue = await RuinGloryCounter.changeCounter(1 * multiplier, counter);
      input.value = newValue;
    }
  
    // ************************* STATIC FUNCTIONS ***************************
  
    /**
     * Set the counter of (type) to (value)
     * @param value Value to set counter to
     * @param type  Type of counter, "glory" or "ruin"
     */
    static async setCounter(value, type) {
      value = Math.round(value);
      let max = game.settings.get("wrath-and-glory", `${type}Max`);

      if (max)
      {
        value = Math.clamp(value, 0, max);
      }
  
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
     * @param type  Type of counter, "glory" or "ruin"
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


  Hooks.on("ready", (app, html, options) => {
    let button = document.createElement("li")
    button.innerHTML = `<button class='control ui-control layer icon fa-solid fa-input-numeric' data-tooltip="${game.i18n.localize("CONTROLS.WNGCounterToggle")}"></button>`
    button.addEventListener("click", ev => {
      // Retain show/hide on refresh by storing in settings
      position = game.settings.get("wrath-and-glory", "counterPosition")
      position.hide = game.counter.rendered;
      game.settings.set("wrath-and-glory", "counterPosition", position);
      
      game.counter.rendered ? game.counter.close({fromControls : true}) : game.counter.render({force : true});
    })
    document.querySelector("#scene-controls-layers").append(button)
  })
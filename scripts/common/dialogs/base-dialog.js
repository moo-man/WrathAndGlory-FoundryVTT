import WrathAndGloryEffect from "../effect.js";

export class RollDialog extends Dialog {

    static get defaultOptions() {
      let options = super.defaultOptions
      options.classes.push("roll-dialog")
      options.resizable = true;
      return options
    }
  
    async _render(...args)
    {
        await super._render(...args)
        let automatic = this._runConditional("script")
        this.applyAutomaticChanges(automatic)
    }
  
    static async create(data) {
      let hide = this.runConditional("hide", data)
      this.removeHiddenChanges(hide, data);
      data.condensedChanges = this.condenseChanges(data.changes);
      const html = await renderTemplate("systems/wrath-and-glory/template/dialog/common-roll.html", data);
      return new Promise((resolve) => {
        new this({
          title: game.i18n.localize(data.title),
          content: html,
          actor : data.actor,
          targets : data.targets,
          dialogData : data,
          buttons: {
            roll: {
              icon: '<i class="fas fa-check"></i>',
              label: game.i18n.localize("BUTTON.ROLL"),
              callback: async (html) => {
                let data = this.dialogCallback(html)
                resolve(data)
              },
            }
          },
          default: "roll"
        }, { width: 550 }).render(true)
      })
    }
  
    static dialogCallback(html) {
      let testData = this._baseTestData()
      testData.difficulty.target = parseInt(html.find("#difficulty-target")[0].value);
      testData.difficulty.penalty = parseInt(html.find("#difficulty-penalty")[0].value);
      testData.difficulty.rank = html.find("#difficulty-rank")[0].value;
      testData.pool.size = parseInt(html.find("#pool-size")[0].value);
      testData.pool.bonus = parseInt(html.find("#pool-bonus")[0].value);
      testData.pool.rank = html.find("#pool-rank")[0].value;
      testData.wounds = html.find("#wounds")[0]?.value
      testData.wrath.base = parseInt(html.find("#wrath-base")[0]?.value);
  
      return testData
    }

    static runConditional(type, data) {
      let results = {}
      for (let id in data.changes) {
        let change = data.changes[id];
        try {
          let func = new Function("data", change.conditional[type]).bind({ actor: data.actor, targets: data.targets, effect: change.document })
          results[id] = (func(data) == true) // Only accept true returns
        }
        catch (e) {
          console.error("Something went wrong when processing conditional dialog effect: " + e, change)
          results[id] = false
        }
      }
      return results
    }

  _runConditional(type)
  {
    return this.constructor.runConditional(type, this.data.dialogData);
  }

  applyAutomaticChanges(automatic) {
    try {
      let automaticIds = Object.keys(automatic).filter(i => automatic[i]);

      // If a condensed change includes at least one ID automatically activate, activate the whole change
      let activatedIndex = this.data.dialogData.condensedChanges.map((cc, index) => {
        if (cc.id.some(id => automaticIds.includes(id)))
          return index;
      }).filter(i => Number.isNumeric(i));

      let select = this.element.find(".effect-select")[0]
      let options = Array.from(select.children)
      options.forEach((opt, index) => {
        if (activatedIndex.includes(index)) {
          opt.selected = true;
          select.dispatchEvent(new Event("change"))
        }
      })
      if (Object.values(automatic).some(i => i))
        select.focus()
    }
    catch(e)
    {
      console.error("Error applying automatic dialog changes: " + e)
    }

  }

    static removeHiddenChanges(hidden, data)
    {
      for(let id in hidden)
      {
        if (hidden[id])
        {
          delete data.changes[id];
        }
      }
    }

    // Condense effects that have the same description into one clickable element
    static condenseChanges(changes)
    {
      let condensed = [];
      for(let id in changes)
      {
        let existing = condensed.find(i => i.description == changes[id].conditional.description)
        if (existing)
        {
          existing.id.push(id);

          // Only push this change's document if it's unique
          if (!existing.tooltip.find(i => i.id == changes[id].document.id))
          {
            existing.tooltip.push(changes[id].document)
          }
        }
        else 
        {
          condensed.push({id : [id], description : changes[id].conditional.description, tooltip : [changes[id].document]})
        }
      }

      condensed.forEach(i => {
        i.tooltip = `From: ${i.tooltip.map(i => i.name).join(", ")}`
      })
      return condensed
    }
  
  
    static _baseTestData() {
      return {
        difficulty: {
          target: 3,
          penalty: 0,
          rank: "none"
        },
        pool: {
          size: 1,
          bonus: 0,
          rank: "none"
        },
        wrath: {
          base: 1
        }
      };
    }
  
    submit(button) {
      let html = this.options.jQuery ? this.element : this.element[0]
      let target = parseInt(html.find("#difficulty-target")[0].value);
      let penalty = parseInt(html.find("#difficulty-penalty")[0].value);
      let rank = html.find("#difficulty-rank")[0].value;
      if (!target && !penalty && rank == "none")
        return ui.notifications.error(game.i18n.localize("DIALOG.NO_DIFFICULTY"))
      else 
        return super.submit(button)
    }
  
    activateListeners(html) {
      super.activateListeners(html);
  
      html.on("mouseenter", ".target", game.wng.utility.highlightToken.bind(this))
      html.on("mouseleave", ".target", game.wng.utility.unhighlightToken.bind(this))
      html.on("click", ".target", game.wng.utility.focusToken.bind(this))
      
      // Reset effect values
      this.effectValues = {
        "pool.base": null,
        "pool.rank": null,
        "pool.bonus": null,
        "difficulty.base": null,
        "difficulty.rank": null,
        "difficulty.bonus": null
      }
  
  
      this.inputs = {}
  
      html.find("input").focusin(ev => {
        ev.target.select();
      })
  
      html.find('.difficulty,.pool').change(ev => {
        let type = ev.currentTarget.classList[0]
        let input = ev.currentTarget.classList[1]
        this.userEntry[`${type}.${input}`] = Number.isNumeric(ev.target.value) ? parseInt(ev.target.value) : ev.target.value
        this.applyEffects()
      }).each((i, input) => {
        this.inputs[`${input.classList[0]}.${input.classList[1]}`] = input
      })
  
      this.userEntry = {
        "pool.base": parseInt(this.inputs["pool.base"].value),
        "pool.rank": this.inputs["pool.rank"].value,
        "pool.bonus": parseInt(this.inputs["pool.bonus"].value),
        "difficulty.base": parseInt(this.inputs["difficulty.base"].value),
        "difficulty.rank": this.inputs["difficulty.rank"].value,
        "difficulty.bonus": parseInt(this.inputs["difficulty.bonus"].value),
      }
  
      html.find(".effect-select").change(this._onEffectSelect.bind(this))
    }
  
    _onEffectSelect(ev) {
      // Reset effect values
      for (let key in this.effectValues)
        this.effectValues[key] = null

      let changes = $(ev.currentTarget).val()
      .map(index => this.data.dialogData.condensedChanges[index]) // Convert indices to condensed changes
      .reduce((prev, current) => prev.concat(current.id), [])     // Combine all condensed ids
      .map(id => this.data.dialogData.changes[id])                // Turn ids into changes

      for (let c of changes) {
        if (WrathAndGloryEffect.numericTypes.includes(c.key))
          this.effectValues[c.key] = (this.effectValues[c.key] || 0) + parseInt(c.value)
        else if (Object.keys(game.wng.config.rankTypes).concat(Object.keys(game.wng.config.difficultyRankTypes)).includes(c.value))
          this.effectValues[c.key] = c.value
      }
      this.applyEffects()
    }

    applyEffects() {
      for (let input in this.inputs) {
        if (!this.inputs[input])
          continue
        if (this.effectValues[input] != null) {
          if (Number.isNumeric(this.effectValues[input]))
            this.inputs[input].value = this.userEntry[input] + this.effectValues[input]
          else
            this.inputs[input].value = this.effectValues[input]
        }
        else // if not part of effect values, use user entry only
        {
          this.inputs[input].value = this.userEntry[input]
        }
      }
    }
  }
  
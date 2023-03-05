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
  
        let automatic = this.runChangeConditionals()
        let select = this.element.find(".effect-select")[0]
        let options = Array.from(select.children)
        options.forEach((opt, i) => {
            if (automatic[i])
            {
                opt.selected = true;
                select.dispatchEvent(new Event("change"))
            }
        })
        if (automatic.some(i => i))
          select.focus()
    }
  
    static async create(data) {
      const html = await renderTemplate("systems/wrath-and-glory/template/dialog/common-roll.hbs", data);
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
  
    runChangeConditionals()
    {
        let results = this.data.dialogData.changes.map(c => {
            try {
                let func = new Function("data", c.conditional.script).bind({actor : this.data.actor, targets : this.data.targets, effect : c.document})
                return (func(this.data.dialogData) == true) // Only accept true returns
            }
            catch (e)
            {
                console.error("Something went wrong when processing conditional dialog effect: " + e, c)
                return false
            }
        })
        return results
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
  
        let changes = []
        $(ev.currentTarget).val().map(i => {
            let indices = i.split(",");
            indices.forEach(changeIndex => {
                changes.push(this.data.dialogData.changes[parseInt(changeIndex)])
            })
        })
  
      changes.forEach(c => {
        if (c.value.toString().includes("@"))
            c.value = (0, eval)(Roll.replaceFormulaData(c.value, c.document.parent.getRollData()))
    })
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
  
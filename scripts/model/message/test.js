import WnGTables from "../../common/tables";

export class WrathAndGloryTestMessageModel extends WarhammerTestMessageModel 
{
    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = {};
        schema.context = new fields.ObjectField();
        schema.testData = new fields.ObjectField();
        schema.result = new fields.ObjectField();
        schema.class = new fields.StringField();
        return schema;
    }

    static get actions() 
    { 
        return foundry.utils.mergeObject(super.actions, {
            rollDamage : this._onRollDamage,
            rollWrath : this._onRollWrath,
            toggleDie : this._onToggleDie,
            rollTest : this._onRollTest,
            rollMutation : this._onRollMutation,
            addPotency : this._onAddPotency,
            resetPotency : this._onResetPotency,
        });
    }

    get test() 
    {
        return game.wng.rollClasses[this.class].recreate(this);
    }

    async getHeaderToken() {
      if (this.test.actor) {
          let token = this.test.actor.getActiveTokens()[0]?.document || this.test.actor.prototypeToken;

          let path = token.hidden ? "modules/impmal-core/assets/tokens/unknown.webp" : token.texture.src;

          if (foundry.helpers.media.VideoHelper.hasVideoExtension(path)) {
              path = await game.video.createThumbnail(path, { width: 50, height: 50 }).then(img => chatOptions.flags.img = img)
          }

          return path;
      }
      else return false
  }

  async onRender(html) {

      let token = await this.getHeaderToken();
      if (token) {
          let header = html.querySelector(".message-header");
          let div = document.createElement("div")
          div.classList.add("message-token");
          let image = document.createElement("img");
          image.src = token
          image.style.zIndex = 1;

          div.appendChild(image);
          header.insertBefore(div, header.firstChild);

          warhammer.utility.replacePopoutTokens(html);
      }


      if (!this.parent.isAuthor && !this.parent.isOwner) 
      {
          html.querySelectorAll("h3").forEach(e => e.dataset.tooltip = "");
      }
  }

    static _onRollDamage(ev, target)
    {
        if (this.parent.isAuthor || this.parent.isOwner)
        {
          let test = this.test;
          test.rollDamage()
        }
    }

    static async _onRollWrath(ev, target)
    {
        let test = this.test;

        WnGTables.rollTable(target.dataset.table)

        if (test.result.isWrathCritical) {
          if (test.weapon) {
            WnGTables.rollTable("critical")
        }
      }
        if (test.result.isWrathComplication) {
          if (test.weapon) {
            WnGTables.rollTable("combatComplications")
          }
          else if (test.power) {
            let modifier = (test.result.allDice.filter(die => die.name == "wrath-complication").length - 1) * 10
            WnGTables.rollTable("perils", {modifier})
          }
          else {
            WnGTables.rollTable("complicationConsequences")
          }
      }
    }
    
    static _onToggleDie(ev, target)
    {
        let message = this.parent;
        if (message.isAuthor || message.isOwner)
          target.classList.toggle("selected")
    }
    static _onRollTest(ev, target)
    {
        let test = this.test;
        let context = {resist : [this.key].concat(test?.item?.type || []), resistingTest : test, appendTitle : ` - ${test.item.name}`}
        if (canvas.tokens.controlled.length)
        {
          for (let token of canvas.tokens.controlled)
          {
            token.actor.setupTestFromData(test.result.test, context);
          }
    
        }
        else if (game.user.character)
        { 
          game.user.character.setupTestFromData(test.item, context);
            
        }
        else 
        {
          return ui.notifications.error(game.i18n.localize("WARN.NoActorsToTest"))
        }
    }
    static async _onRollMutation(ev, target)
    {
        let test = this.test;
    
        let table = game.tables.getName("Mutation Severity")
        let roll = new Roll(table.formula)
        let result = await table.roll({ roll })
        ChatMessage.create({ content: result.results[0].getChatText() + ` (${result.roll.total})`, roll : result.roll, type: CONST.CHAT_MESSAGE_TYPES.ROLL, flavor: `Mutation`, speaker : test.context.speaker })
    }
    static _onAddPotency(ev, target)
    {
        let test = this.test;
    
        test.addAllocation(parseInt(target.dataset.index))
    }
    static _onResetPotency(ev, target)
    {
        let test = this.test;
        test.resetAllocation()
    }
}
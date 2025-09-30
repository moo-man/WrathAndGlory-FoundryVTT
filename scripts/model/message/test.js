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
            scatter : this._onScatter,
            blast : this._onBlast
        });
    }

    get test() 
    {
        return game.wng.rollClasses[this.class].recreate(this);
    }

    async getHeaderToken() {
      if (this.test.actor) {
          let token = this.test.actor.getActiveTokens()[0]?.document || this.test.actor.prototypeToken;

          let path = token.hidden ? "modules/wng-core/assets/tokens/generic.webp" : token.texture.src;

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
            WnGTables.rollTable("perils", null, {modifier})
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
        ChatMessage.create({ content: await result.results[0].getHTML() + ` (${result.roll.total})`, roll : result.roll, type: CONST.CHAT_MESSAGE_TYPES.ROLL, flavor: `Mutation`, speaker : test.context.speaker })
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

    static _onScatter(ev, target)
    {
      let scatterRoll = Math.ceil(CONFIG.Dice.randomUniform() * 6)
      let distRoll = Math.ceil(CONFIG.Dice.randomUniform() * 6) * 2
      let html = `
      <table class="scatter-table" border="1">
      <tr>
            <td data-position='3'><div class="die-label">3</div></td>
            <td data-position='4'><div class="die-label">4</div></td>
            <td data-position='5'><div class="die-label">5</div></td>
      </tr>
      <tr>
            <td data-position='2'><div class="die-label">2</div></td>
            <td> <strong>Target</strong></td>
            <td data-position="6"><div class="die-label">6</div></td>
      </tr>
      <tr>
            <td></td>
            <td data-position='1'><div class="die-label">1</div></td>
            <td></td>
      </tr>
</table>
<p style="text-align: center;"><i class="fa-solid fa-arrow-up"></i> Direction of Attack <i class="fa-solid fa-arrow-up"></i></p>
      `

      html = html.replace(`data-position='${scatterRoll}'>`, `data-position='${scatterRoll}' class="active">${distRoll}m<br>`)


      ChatMessage.create({content:  html, speaker : {alias : "Scatter"}, flavor : this.test.context.title})
    }

    static _onBlast(ev, target)
    {
      AreaTemplate.fromString(target.dataset.blast, null, null, null, false).drawPreview(ev);
    }
}
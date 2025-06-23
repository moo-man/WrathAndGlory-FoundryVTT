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
        let chatData = {}
        let table
        let roll
        let result
        if (test.result.isWrathCritical) {
          if (test.weapon) {
            table = game.tables.getName(game.i18n.localize("TABLE.CRITICAL_HIT_TABLE"))
            if (!table)
              return ui.notifications.error(game.i18n.format("ROLL.CannotFindTable", {name : game.i18n.localize("TABLE.CRITICAL_HIT_TABLE")}))
            roll = new Roll(table.formula)
            result = await table.roll({ roll })
            chatData = { content: result.results[0].getChatText() + ` (${result.roll.total})`, flavor: `Critical Hit` }
          }
        }
        if (test.result.isWrathComplication) {
          if (test.weapon) {
            table = game.tables.getName(game.i18n.localize("TABLE.COMBAT_COMPLICATIONS"))
            if (!table)
              return ui.notifications.error(game.i18n.format("ROLL.CannotFindTable", {name : game.i18n.localize("TABLE.COMBAT_COMPLICATIONS")}))
            roll = new Roll(table.formula)
            result = await table.roll({ roll })
            chatData = { content: result.results[0].getChatText() + ` (${result.roll.total})`, flavor: `Combat Complication` }
          }
          else if (test.power) {
            table = game.tables.getName(game.i18n.localize("TABLE.PERILS_OF_THE_WARP"))
            if (!table)
              return ui.notifications.error(game.i18n.format("ROLL.CannotFindTable", {name : game.i18n.localize("TABLE.PERILS_OF_THE_WARP")}))
            let modifier = (test.result.allDice.filter(die => die.name == "wrath-complication").length - 1) * 10
            roll = new Roll(table.formula + " + " + modifier)
            result = await table.roll({ roll })
            chatData = { content: result.results[0].getChatText() + ` (${result.roll.total})`, flavor: `Perils of the Warp ${modifier ? "(+" + modifier + ")" : ""}` }
          }
          else {
            table = game.tables.getName(game.i18n.localize("TABLE.COMPLICATION_CONSEQUENCES"))
            if (!table)
              return ui.notifications.error(game.i18n.format("ROLL.CannotFindTable", {name : game.i18n.localize("TABLE.COMPLICATION_CONSEQUENCES")}))
            roll = new Roll(table.formula)
            result = await table.roll({ roll })
            chatData = { content: result.results[0].getChatText() + ` (${result.roll.total})`, flavor: `Complication Consequence` }
          }
        }
        if (chatData.content)
        {
          chatData.speaker = test.context.speaker
          chatData.roll = result.roll
          chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL
          return ChatMessage.create(chatData)
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
import WrathAndGloryEffect from "./effect.js"

export default class WNGChat {
  static chatListeners(html) {
    html.on("click", ".roll-damage", this._onDamageClick.bind(this))
    html.on("click", ".roll-wrath", this._onWrathClick.bind(this))
    html.on("click", "a.die", this._onDieClick.bind(this))
    html.on("click", ".test-effect", this._onEffectClick.bind(this))
    html.on("click", ".invoke-test", this._onTestClick.bind(this))
    html.on("click", ".roll-mutation", this._onMutationClick.bind(this))
    html.on("click", ".add-potency", this._onPotencyClick.bind(this))
    html.on("click", ".potency-reset", this._onPotencyReset.bind(this))
  }

  static _onDamageClick(ev) {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    if (message.isAuthor || message.isOwner)
    {
      let test = message.getTest();
      test.rollDamage()
    }
  }

  static async _onWrathClick(ev) {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    let test = message.getTest();
    let chatData = {}
    let table
    let roll
    let result
    if (test.result.isWrathCritical) {
      if (test.weapon) {
        table = game.tables.getName("Critical Hit Table")
        roll = new Roll(table.data.formula)
        result = await table.roll({ roll })
        chatData = { content: result.results[0].data.text + ` (${result.roll.total})`, flavor: `Critical Hit` }
      }
    }
    if (test.result.isWrathComplication) {
      if (test.weapon) {
        table = game.tables.getName("Combat Complications")
        roll = new Roll(table.data.formula)
        result = await table.roll({ roll })
        chatData = { content: result.results[0].data.text + ` (${result.roll.total})`, flavor: `Combat Complication` }
      }
      else if (test.power) {
        table = game.tables.getName("Perils of the Warp")
        let modifier = (test.result.allDice.filter(die => die.name == "wrath-complication").length - 1) * 10
        roll = new Roll(table.data.formula + " + " + modifier)
        result = await table.roll({ roll })
        chatData = { content: result.results[0].data.text + ` (${result.roll.total})`, flavor: `Perils of the Warp ${modifier ? "(+" + modifier + ")" : ""}` }
      }
      else {
        table = game.tables.getName("Complication Consequences")
        roll = new Roll(table.data.formula)
        result = await table.roll({ roll })
        chatData = { content: result.results[0].data.text + ` (${result.roll.total})`, flavor: `Complication Consequence` }
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

  static _onDieClick(ev) {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    if (message.isAuthor || message.isOwner)
      ev.currentTarget.classList.toggle("selected")
  }

  static async _onEffectClick(ev)
  {
      let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
      let effectId = $(ev.currentTarget).attr("data-id")
      let msg = game.messages.get(id)
      let test = msg.getTest();
      let item = test.item
      let effect = test.getEffect(effectId).toObject()

      WrathAndGloryEffect.populateEffectData(effect, test, item);
      
      if (canvas.tokens.controlled.length)
      {
          for (let t of canvas.tokens.controlled)
              t.actor.createEmbeddedDocuments("ActiveEffect", [effect])
      }
      else if (game.user.character)
          game.user.character.createEmbeddedDocuments("ActiveEffect", [effect])

      else
          return ui.notifications.warn(game.i18n.localize("WARN.NoActorsToApply"))

 
  }

  static async _onTestClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let msg = game.messages.get(id)
    let msgTest = msg.getTest();
    let itemTest = msgTest.result.test;

    if (canvas.tokens.controlled.length)
    {
      for (let token of canvas.tokens.controlled)
      {
        let testFunction;
        if (itemTest.type == "attribute")
          testFunction = token.actor.setupAttributeTest.bind(token.actor)
        else if (itemTest.type == "skill")
          testFunction = token.actor.setupSkillTest.bind(token.actor)
        else
        {
          testFunction = token.actor.setupGenericTest.bind(token.actor)
          itemTest = duplicate(itemTest)
        }

        await testFunction(itemTest.specification, {dn: itemTest.dn, resistPower : msgTest.item?.type == "psychicPower"}).then(async test => {
          await test.rollTest();
          test.sendToChat()
        })
      }

    }
    else if (game.user.character)
    { 
      let testFunction;
      if (itemTest.type == "attribute")
        testFunction = game.user.character.setupAttributeTest.bind(game.user.character)
      else if (itemTest.type == "skill")
        testFunction = game.user.character.setupSkillTest.bind(game.user.character)
      else
      {
        testFunction = game.user.character.setupGenericTest.bind(game.user.character)
        itemTest = duplicate(itemTest)
      }

      await testFunction(itemTest.specification, {dn: itemTest.dn}).then(async test => {
        await test.rollTest();
        test.sendToChat()
      })
    }
    else 
      return ui.notifications.error(game.i18n.localize("WARN.NoActorsToTest"))
  }
  
  static async _onMutationClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let msg = game.messages.get(id)
    let test = msg.getTest();

    let table = game.tables.getName("Mutation Severity")
    let roll = new Roll(table.data.formula)
    let result = await table.roll({ roll })
    ChatMessage.create({ content: result.results[0].getChatText() + ` (${result.roll.total})`, roll : result.roll, type: CONST.CHAT_MESSAGE_TYPES.ROLL, flavor: `Mutation`, speaker : test.context.speaker })
  }

  static async _onPotencyClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let msg = game.messages.get(id)
    let test = msg.getTest();

    test.addAllocation(parseInt(ev.currentTarget.dataset.index))
  }
  
  static async _onPotencyReset(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let msg = game.messages.get(id)
    let test = msg.getTest();
    test.resetAllocation()
  }
}
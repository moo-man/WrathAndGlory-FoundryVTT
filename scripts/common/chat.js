import WNGUtility from "./utility"

export default class WNGChat {
  static chatListeners(html) {
    html.on("click", ".apply-damage", this._onApplyDamage.bind(this))
    html.on("click", ".roll-damage", this._onDamageClick.bind(this))
    html.on("click", ".roll-wrath", this._onWrathClick.bind(this))
    html.on("click", "a.die", this._onDieClick.bind(this))
    html.on("click", ".test-effect", this._onEffectClick.bind(this))
    html.on("click", ".roll-test", this._onTestClick.bind(this))
    html.on("click", ".roll-mutation", this._onMutationClick.bind(this))
    html.on("click", ".add-potency", this._onPotencyClick.bind(this))
    html.on("click", ".potency-reset", this._onPotencyReset.bind(this))
    // html.on("mouseenter", ".target", WNGUtility.highlightToken.bind(this))
    // html.on("mouseleave", ".target", WNGUtility.unhighlightToken.bind(this))
    // html.on("click", ".target", WNGUtility.focusToken.bind(this))
    html.on("click", ".apply-target", WarhammerChatListeners.onApplyTargetEffect)
    html.on("click", ".place-area", WarhammerChatListeners.onPlaceAreaEffect)
  }

  static async _onApplyDamage(ev)
  {
    let damage = game.messages.get($(ev.target).parents(".message").attr("data-message-id")).system.damage;
    damage.applyToTargets();
  }

  static _onDamageClick(ev) {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    if (message.isAuthor || message.isOwner)
    {
      let test = message.system.test;
      test.rollDamage()
    }
  }

  static async _onWrathClick(ev) {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    let test = message.system.test;
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
      let test = msg.system.test;
      let item = test.item
      let effect = test.getEffect(effectId).toObject()

      ActiveEffect.implementation.populateEffectData(effect, test, item);
      
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
    let test = msg.system.test;
    let options = {resist : [this.key].concat(test?.item?.type || []), resistingTest : test, appendTitle : ` - ${test.item.name}`}
    if (canvas.tokens.controlled.length)
    {
      for (let token of canvas.tokens.controlled)
      {
        token.actor.setupTestFromData(test.result.test, options);
      }

    }
    else if (game.user.character)
    { 
      game.user.character.setupTestFromData(test.item, options);
        
    }
    else 
    {
      return ui.notifications.error(game.i18n.localize("WARN.NoActorsToTest"))
    }
  }
  
  static async _onMutationClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let msg = game.messages.get(id)
    let test = msg.system.test;

    let table = game.tables.getName("Mutation Severity")
    let roll = new Roll(table.formula)
    let result = await table.roll({ roll })
    ChatMessage.create({ content: result.results[0].getChatText() + ` (${result.roll.total})`, roll : result.roll, type: CONST.CHAT_MESSAGE_TYPES.ROLL, flavor: `Mutation`, speaker : test.context.speaker })
  }

  static async _onPotencyClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let msg = game.messages.get(id)
    let test = msg.system.test;

    test.addAllocation(parseInt(ev.currentTarget.dataset.index))
  }
  
  static async _onPotencyReset(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let msg = game.messages.get(id)
    let test = msg.system.test;
    test.resetAllocation()
  }
}
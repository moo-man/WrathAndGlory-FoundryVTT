export default class WNGChat {
  static chatListeners(html)
  {
    html.on("click", ".roll-damage", this._onDamageClick.bind(this))
    html.on("click", ".roll-wrath", this._onWrathClick.bind(this))
    html.on("click", "a.die", this._onDieClick.bind(this))
  }

  static _onDamageClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    let test = message.getTest();
    test.rollDamage()
    test.sendDamageToChat();
  }

  static async _onWrathClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    let test = message.getTest();
    let chatData = {}
    let table
    let roll
    let result
    if(test.result.isWrathCritical)
    {
      if(test.weapon)
      {
        table = game.tables.getName("Critical Hit Table")
        roll = new Roll(table.data.formula)
        result = await table.roll({roll})
        chatData = {content : result.results[0].data.text + ` (${result.roll.total})`, flavor : `Critical Hit`}
      }
    }
    if (test.result.isWrathComplication)
    {
      if (test.weapon)
      {
        table = game.tables.getName("Combat Complications")
        roll = new Roll(table.data.formula)
        result = await table.roll({roll})
        chatData = {content : result.results[0].data.text + ` (${result.roll.total})`, flavor : `Combat Complication`}
      }
      else if (test.power)
      {
        table = game.tables.getName("Perils of the Warp")
        let modifier = (test.result.allDice.filter(die => die.name == "wrath-complication").length - 1) * 10
        roll = new Roll(table.data.formula + " + " + modifier)
        result = await table.roll({roll})
        chatData = {content : result.results[0].data.text + ` (${result.roll.total})`, flavor : `Perils of the Warp ${modifier ? "(+" + modifier + ")" : ""}`}
      }
      else 
      {
        table = game.tables.getName("Complication Consequences")
        roll = new Roll(table.data.formula)
        result = await table.roll({roll})
        chatData = {content : result.results[0].data.text + ` (${result.roll.total})`, flavor : `Complication Consequence`}
      }
      chatData.speaker = test.context.speaker
      chatData.roll = result.roll
      chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL

      return ChatMessage.create(chatData)
    }
  }

  static _onDieClick(ev)
  {
    if (ev.currentTarget.classList.contains("selected"))
      return ev.currentTarget.classList.remove("selected")

    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    let test = message.getTest();
    let index = parseInt(ev.currentTarget.dataset.index);
    
    if (test.result.allDice[index].canShift && test.result.shiftsPossible > 0 && !ev.currentTarget.classList.contains("shifted"))
      ev.currentTarget.classList.add("selected")

  }
}
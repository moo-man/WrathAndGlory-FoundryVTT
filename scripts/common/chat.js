export default class WNGChat {
  static chatListeners(html)
  {
    html.on("click", ".roll-damage", this._onDamageClick.bind(this))
    html.on("click", ".roll-wrath", this._onWrathClick.bind(this))
  }

  static _onDamageClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    let test = message.getTest();
    test.sendDamageToChat();
  }

  static _onWrathClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    let test = message.getTest();
    if(test.result.isWrathCritical)
    {
      if(test.weapon)
        game.tables.getName("Critical Hit Table").draw()
    }
    if (test.result.isWrathComplication)
    {
      if (test.weapon)
        game.tables.getName("Combat Complications").draw()
      else if (test.power)
        game.tables.getName("Perils of the Warp").draw()
      else 
        game.tables.getName("Complication Consequences").draw()
    }
  }
}
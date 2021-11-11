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
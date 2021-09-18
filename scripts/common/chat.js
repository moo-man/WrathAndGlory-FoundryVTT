export default class WNGChat {
  static chatListeners(html)
  {
    html.on("click", ".roll-damage", this._onDamageClick.bind(this))
  }

  static _onDamageClick(ev)
  {
    let id = $(ev.currentTarget).parents(".message").attr("data-message-id")
    let message = game.messages.get(id)
    let test = message.getTest();
    test.sendDamageToChat();
  }
}
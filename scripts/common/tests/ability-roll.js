import { WNGTest } from "./test.js"

// Used for items that don't roll tests, just roll damage or cause effects
export default class AbilityRoll extends WNGTest {
  constructor(data = {})
  {
    if (foundry.utils.isEmpty(data))
    {
      // Recreated test
      super(data)
      return;
    }
    else 
    {
      // New Test
      data.targets = Array.from(game.user.targets).map(t => t.actor?.speakerData(t.document));
      super(data)
    }

    this.testData.itemId = data.item?.uuid;
    
    let item = data.item;

    if (item.system.test.self)
    {
      this.testSelf = true;
    }

    this.data.context.title = data.title;
  }

  get template() {
    return "systems/wrath-and-glory/templates/chat/roll/ability/ability-use.hbs"
  }


  async rollTest() {
    this._computeResult();
    this.result.enrichedDescription = await foundry.applications.ux.TextEditor.enrichHTML(this.item.system.description, {secrets: false, relativeTo: this.item})
  }

  _computeResult()
  {
    this.data.result = {}
    if (this.item.hasTest) this.result.test = this.item.system.test.toObject(false);
    this.result.isSuccess = true;
    if (this.testData.damage)
    {
      this.computeDamage()
    }
  }
  
  async sendToChat({ newMessage = null, chatDataMerge = {} } = {}) {

    const html = await foundry.applications.handlebars.renderTemplate(this.template, this);
    let chatData = {
      _id : randomID(),
      type: "test",
      rolls: [],
      system: this.data,
      user: game.user.id,
      rollMode: this.context.rollMode,
      content: html,
      speaker: this.context.speaker
    };
    chatData.speaker.alias = this.actor.token ? this.actor.token.name : this.actor.prototypeToken.name
    ChatMessage.applyRollMode(chatData, chatData.rollMode);

    if (newMessage || !this.message) 
    {
      this.context.messageId = chatData._id
      await ChatMessage.create(chatData, {keepId : true});
    }
    else {
      delete chatData.roll
      return this.message.update(chatData)
    }
  }


  get ability() {return true}  
}

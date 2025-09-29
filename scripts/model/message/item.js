export class PostedItemMessageModel extends WarhammerMessageModel
{
    static defineSchema() 
    {
        let fields = foundry.data.fields;
        let schema = {};
        schema.itemData = new fields.ObjectField({});
        return schema;
    }

    static async postItem(item, mergeData={})
    {
        const html = await foundry.applications.handlebars.renderTemplate("systems/wrath-and-glory/templates/chat/item.hbs", { item, data: item.system });
        const chatData = foundry.utils.mergeObject({
            user: game.user.id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            type : "item",
            system : {
                itemData :  item.toObject()
            }
        }, mergeData);

        ChatMessage.applyRollMode(chatData, chatData.rollMode);
        ChatMessage.create(chatData);
    }

    async onRender(html) {

        let post = html.querySelector(".item")
        if (post)
        {
            post.draggable = true;
            post.addEventListener("dragstart", ev => {
                ev.dataTransfer.setData("text/plain", JSON.stringify({ type: "Item", data: this.itemData }));
            })
        }
    }

    get item()
    {
        return new Item.implementation(this.itemData);
    }
}
import { StandardItemModel } from "./components/standard";

let fields = foundry.data.fields;

export class KeywordModel extends StandardItemModel
{
    static LOCALIZATION_PREFIXES = ["WH.Models.keyword"];

    static defineSchema() 
    {
        let schema = super.defineSchema();
        schema.group = new fields.StringField();
        return schema;
    }

    async _preUpdate(data, options, user)
    {
        if (data.system?.group)
        {
            data.system.group = data.system.group.toUpperCase().replace("[", "").replace("]", "");
        }
    }

    async _preCreate(data, options, user)
    {
        if (this.parent.actor)
        {

            if (this.isUnchosenGroup)
            {
                this.parent.updateSource(await this.specifyGroup());
            }
            
            if (this.group && this.parent.actor)
            {
                // Remove any existing keyword of the same group
                let existingGroupKeyword = this.parent.actor.getGroupKeyword(this.group, {item: true}).filter(i => i.system.isUnchosenGroup)[0];
                if (existingGroupKeyword)
                {
                    ui.notifications.notify(`Replacing ${existingGroupKeyword.name} with ${this.parent.name}`);
                    existingGroupKeyword.delete();
                }
            }
        }
    }

    async specifyGroup()
    {
        if (this.group)
        {
            let name = await ValueDialog.create({text: `Enter ${this.group}`, title: this.parent.name})
            if (name)
            {
                let keywordItem = await game.wng.utility.getKeywordItem(name, this, this.parent.img);
                if (keywordItem)
                {
                    let keywordData = keywordItem.toObject();
                    // If for some reason the found keyword doesn't match the group, just set it as the group
                    if (keywordData.system.group != this.group)
                    {
                        keywordData.system.group = this.group;
                    }
                    return keywordData;
                }
                else 
                {
                    return {name: name.toUpperCase()};
                }
            }
            else
            {
                return {};
            }
        }
        else
        {
            return {};
        }
    }

    get isGroup()
    {
        return this.group;
    }

    get isUnchosenGroup()
    {
        return this.group && this.parent.name.includes("[") && this.parent.name.includes("]")
    }

}
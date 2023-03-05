
export default class FilterResults extends FormApplication {
    constructor(object) {
        super(object)
    }

    static get defaultOptions() {
        let options = super.defaultOptions;
        options.classes.push("filter-results");
        options.title = "Filter Results";
        options.template = "systems/wrath-and-glory/template/apps/filter-results.hbs",
        options.width = 300,
        options.height = 800,
        options.resizable = true
        return options;
    }

    async getData() {
        let data = super.getData();
        let filters = this.object.wargear.filters
        let items = await this.getAllItems();
        items = this.applyFilters(items, filters)
        data.items = items;
        return data
    }


    async _updateObject(event) {
        let choice = $(event.currentTarget).find(".active");
        let choiceId = choice.attr("data-id")

        if (choice)
        {
            this.object.app.chooseWargear(this.object.wargear, choiceId)
        }
    }

    async getAllItems() {
        let items = game.items.contents

        let packs = await Promise.all(game.packs.filter(p => p.metadata.type == "Item").map(i => i.getDocuments()))

        packs.forEach(p => {        // Remove duplicates (match by ID, don't show compendium item if world item already listed)
            items = items.concat(p.filter(i => !items.find(existing => existing.id == i.id)));
        })

        return items.sort((a, b) => a.name > b.name ? 1 : -1)
    }

    applyFilters(items, filters) {
        filters.forEach(f => {
            items = items.filter(i => {
                let itemData = i.toObject();
                itemData.hasKeyword = (keyword) => {
                    let keywords = itemData.system.keywords
                    if (!keywords) return false

                    if (!Array.isArray(keywords))
                        keywords = keywords.split(",")

                    keywords = keywords.map(i => i.trim().toLowerCase())
                    return keywords.includes(keyword.toLowerCase())
                }

                if (f.property.includes("("))
                {
                    let split = f.property.split("(")
                    split[1] = split[1].substring(0, split[1].length - 1)
                    split[1] = split[1].split("").filter(i => i != '"').join("")
                    return itemData[split[0]](split[1]) // Invoke function
                }
                
                let propValue = getProperty(itemData, f.property)
                let testValue = f.value;
                let test = f.test
                
                // Convert rarity to a number so that ranges of rarities can be used
                if (f.property == "data.rarity")
                {
                    propValue = this.rarityNumber[propValue]
                    testValue = this.rarityNumber[testValue]
                }

                if ([propValue, test, testValue].includes(undefined))
                    return false
                return (0, eval)(`"${propValue}" ${this.comparisons[test]} "${testValue}"`)
            })
        })
        return items
    }

    get comparisons() {
        return {
            "lt": "<",
            "le": "<=",
            "eq": "==",
            "gt": ">",
            "ge": ">="
        }
    }

    get rarityNumber() {
        return {
            "common": 1,
            "uncommon": 2,
            "rare": 3,
            "very-rare": 4,
            "unique": 5
        }
    }

    activateListeners(html)
    {
        super.activateListeners(html);

        html.find(".document-name").click(ev => {
            let list = $(ev.currentTarget).parents(".directory-list")

            list.find(".active").each((i, e) => {
                e.classList.remove("active")
            })

            let document = $(ev.currentTarget).parents(".document")[0]
            document.classList.add("active")
        })

        html.find(".document-name").contextmenu(ev => {
            let document = $(ev.currentTarget).parents(".document")
            let id = document.attr("data-id")

            game.items.get(id).sheet.render(true, {editable: false})
        })
    }


}
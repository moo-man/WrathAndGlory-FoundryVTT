
export default class FilterResults extends FormApplication {
    constructor(object) {
        super(object)
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "filter-results",
            title: "Filter Results",
            template: "systems/wrath-and-glory/template/apps/filter-results.html",
            width: 300,
            height: 800,
            resizable: true
        })
    }

    async getData() {
        let data = super.getData();
        let filters = this.object.wargear.filters
        let items = await this.getAllItems();
        items = this.applyFilters(items, filters)
        console.log(items)
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

        packs.forEach(p => {
            items = items.concat(p);
        })

        return items
    }

    applyFilters(items, filters) {
        filters.forEach(f => {
            items = items.filter(i => {
                let propValue = getProperty(i.data, f.property)
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
                return eval(`"${propValue}" ${this.comparisons[test]} "${testValue}"`)
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
            "common": 0,
            "uncommon": 1,
            "rare": 2,
            "very-rare": 3,
            "unique": 4
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
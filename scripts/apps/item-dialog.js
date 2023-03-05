
export default class ItemDialog extends Dialog {
    static template = "systems/wrath-and-glory/template/apps/item-dialog.html"

    static get defaultOptions() {
        let options = super.defaultOptions
        options.width= 300,
        options.height=  800,
        options.resizable = true
        options.classes.push("item-dialog")
        return options
    }


    static async create(items= [], number, options)
    {
        return new Promise(async (resolve) => {

            let html = await renderTemplate(this.template, {items, number})
            new this({
                title : "Choose Items",
                content : html,
                number,
                items,
                buttons : {
                    submit :
                    {
                        label : "Submit", 
                        callback :  (dlg) => {
                            resolve(Array.from(dlg.find(".active")).map(el => items[el.dataset.index]))
                        }
                    }
                },
                close : () => {resolve([])}
            }).render(true, options)
        })
    }

    activateListeners(html)
    {
        super.activateListeners(html);

        html.find(".document-name").click(ev => {
            let document = $(ev.currentTarget).parents(".document")[0]
            let list = $(ev.currentTarget).parents(".directory-list")

            let choices = list.find(".active").length

            if (!document.classList.contains("active"))
            {
                if (Number.isNumeric(this.data.number) && choices >= this.data.number)
                    return

                else document.classList.add("active")
            }
            else // Already active, remove active
            {
                document.classList.remove("active")
            }
        })

        html.find(".document-name").contextmenu(ev => {
            let document = $(ev.currentTarget).parents(".document")
            let index = document.attr("data-index")

            this.data.items[index].sheet.render(true, {editable: false})
        })
    }


}

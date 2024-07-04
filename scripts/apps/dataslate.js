export class DataslatePageSheet extends JournalTextPageSheet {

    static get defaultOptions() {
        let options = super.defaultOptions
        options.viewClasses.push("dataslate")
        return options
    }


    async getData() {
        let data = await super.getData();
        return data
    }
}


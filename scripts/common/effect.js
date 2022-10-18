export default class WrathAndGloryEffect extends ActiveEffect {

    /** @override 
     * Adds support for referencing actor data
     * */ 
    apply(actor, change) {
    if (change.value.includes("@"))
        actor.derivedEffects.push((change))
    else 
        super.apply(actor, change)
    }

    fillDerivedData(actor, change)
    {
        try {
            change.value = (0, eval)(Roll.replaceFormulaData(change.value, actor.getRollData())).toString();
        }
        catch(e)
        {
            console.error("Something went wrong when filling derived effect: " + e)
        }
    }

    get item() {
        if (this.parent && this.parent.documentName == "Item")
            return this.parent
        else if (this.origin && this.parent.documentName == "Actor") 
        {
            let origin = this.origin.split(".")
            if (origin[1] == this.parent.id) // If origin ID is same as parent ID
            {
                if (origin[3])
                {
                    return this.parent.items.get(origin[3])
                }
            }
        }
    }

    getDialogChanges({target = false, condense = false, indexOffset = 0}={}) {
        let allChanges = this.changes.map(c => foundry.utils.deepClone(c))
        allChanges.forEach((c, i) => {
            c.conditional = this.changeConditionals[i] || {}
            c.document = this
        })
        let dialogChanges = allChanges.filter((c) => c.mode == (target ? 7 : 6)) // Targeter dialog is 7, self dialog is 6
        dialogChanges.forEach((c, i) => {
            c.target = !!target
            c.index = [i + indexOffset]
            if (this.parent?.documentName == "Actor")
                this.fillDerivedData(this.parent, c)
        })

        // changes with the same description as under the same condition (use the first ones' script)
        if (condense)
        {
            let uniqueChanges = []
            dialogChanges.forEach(c => {
                let existing = uniqueChanges.find(unique => unique.conditional.description == c.conditional.description)
                if (existing)
                    existing.index = existing.index.concat(c.index)
                else
                    uniqueChanges.push(c)
            })
            dialogChanges = uniqueChanges
        }

        return dialogChanges
    }

     /**
     * Takes a test object and returns effect data populated with the results and overcasts computed
     * 
     * @param {Test} test 
     */
    static populateEffectData(effectData, test, item)
    {
        effectData.origin = test.actor.uuid

        // Set statusId so that the icon shows on the token
        setProperty(effectData, "flags.core.statusId", getProperty(effectData, "flags.core.statusId") || effectData.label.slugify())
        
        if(!item)  
            item = test.item

        // Prioritize test result duration over item duration (test result might be overcasted)
        let duration = test.result.duration || item.duration
        if (duration)
        {
            if (duration.unit == "round")
                effectData.duration.rounds = parseInt(duration.value)
            else if  (duration.unit == "minute")
                effectData.duration.seconds = parseInt(duration.value) * 60
            else if (duration.unit == "hour")
                effectData.duration.seconds = parseInt(duration.value) * 60 * 60
            else if (duration.unit == "day")
                effectData.duration.seconds = parseInt(duration.value) * 60 * 60 * 24
        }

        // Some effects may need to take from test data to fill its change value (to match with possible overcasts)
        // These effects have a change value of `@test.result.<some-property>`
        for(let change of effectData.changes)
        {
            let split = change.value.split(".")
            // Remove @test and replace it with the value
            let value = change.value
            if (split[0] == "@test")
            {
                // Remove @test and get the property from the test (@test.result.damage.total -> result.damage.total -> actual value)
                split.splice(0, 1)
                value = split.join(".")
                value = getProperty(test, value)
                if (Number.isNumeric(value))
                    change.value = Number(value)
                else 
                    change.value = 0
            }
        }
        return effectData


    }

    get changeConditionals() {
        return (getProperty(this.data, "flags.wrath-and-glory.changeCondition") || {})
    }
    get description() {
        return getProperty(this.data, "flags.wrath-and-glory.description")
    }

    get hasRollEffect() {
        return this.changes.some(c => c.mode == 0)
    }

    get sourceName() {
        if (!this.origin)
            return super.sourceName

        let data = this.origin.split(".")

        if (data.length == 4) {
            let item = this.parent.items.get(data[3])
            if (item)
                return item.name
        }

        return super.sourceName
    }

    get isCondition() {
        return CONFIG.statusEffects.map(i => i.id).includes(this.getFlag("core", "statusId"))
    }

    static get numericTypes() {
        return [
            "pool.base",
            "pool.bonus",
            "difficulty.base",
            "difficulty.bonus",
            "damage.base",
            "damage.bonus",
            "ed.base",
            "ed.bonus",
            "ap.base",
            "ap.bonus",
            "wrath"
        ]
    }

}